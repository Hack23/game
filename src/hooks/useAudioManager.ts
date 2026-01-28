import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";

interface AudioManager {
  playHitSound: () => void;
  playComboSound: () => void;
  playLevelUpSound: () => void;
  playGameOverSound: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
}

/**
 * Custom hook to manage game audio using Howler.js
 * Generates simple sound effects using synthesized audio
 * @returns Audio control functions
 */
export function useAudioManager(): AudioManager {
  const soundsRef = useRef<{
    hit: Howl | null;
    combo: Howl | null;
    levelUp: Howl | null;
    gameOver: Howl | null;
    background: Howl | null;
  }>({
    hit: null,
    combo: null,
    levelUp: null,
    gameOver: null,
    background: null,
  });

  // Store original volume levels for each sound to preserve hierarchy
  const originalVolumesRef = useRef<{
    hit: number;
    combo: number;
    levelUp: number;
    gameOver: number;
    background: number;
  }>({
    hit: 0.7,
    combo: 0.8,
    levelUp: 0.85,
    gameOver: 0.7,
    background: 0.2,
  });

  const isMutedRef = useRef(false);
  const volumeRef = useRef(1.0); // Default volume at 100%

  // Generate simple tones using Web Audio API for game sounds
  useEffect(() => {
    try {
      // Create hit sound - punchy beep with harmonics
      soundsRef.current.hit = new Howl({
        src: [generateToneDataURL(880, 0.12, 0.8)], // A5 note, 120ms, louder
        format: ['wav'],
        volume: 0.7,
        onloaderror: (_id, error) => {
          console.error('Failed to load hit sound:', error);
        },
      });

      // Create combo sound - bright ascending arpeggio
      soundsRef.current.combo = new Howl({
        src: [generateArpeggioSound()],
        format: ['wav'],
        volume: 0.8,
        onloaderror: (_id, error) => {
          console.error('Failed to load combo sound:', error);
        },
      });

      // Create level up sound - triumphant fanfare
      soundsRef.current.levelUp = new Howl({
        src: [generateLevelUpSound()],
        format: ['wav'],
        volume: 0.85,
        onloaderror: (_id, error) => {
          console.error('Failed to load level up sound:', error);
        },
      });

      // Create game over sound - deep descending tone
      soundsRef.current.gameOver = new Howl({
        src: [generateToneDataURL(196, 0.6, 0.8)], // G3 note, 600ms
        format: ['wav'],
        volume: 0.7,
        onloaderror: (_id, error) => {
          console.error('Failed to load game over sound:', error);
        },
      });

      // Create background music - rhythmic electronic game music
      soundsRef.current.background = new Howl({
        src: [generateBackgroundMusic()],
        format: ['wav'],
        volume: 0.2,
        loop: true,
        onloaderror: (_id, error) => {
          console.error('Failed to load background music:', error);
        },
      });

      console.debug('✓ All sounds initialized successfully');
    } catch (error) {
      console.error('Error initializing audio:', error);
    }

    // Cleanup on unmount - capture sounds ref for cleanup
    const sounds = soundsRef.current;
    return (): void => {
      Object.values(sounds).forEach((sound) => {
        if (sound !== null) {
          sound.unload();
        }
      });
    };
  }, []);

  const playHitSound = useCallback((): void => {
    if (soundsRef.current.hit !== null && !isMutedRef.current) {
      try {
        soundsRef.current.hit.play();
      } catch (error) {
        console.error('Error playing hit sound:', error);
      }
    }
  }, []);

  const playComboSound = useCallback((): void => {
    if (soundsRef.current.combo !== null && !isMutedRef.current) {
      try {
        soundsRef.current.combo.play();
      } catch (error) {
        console.error('Error playing combo sound:', error);
      }
    }
  }, []);

  const playLevelUpSound = useCallback((): void => {
    if (soundsRef.current.levelUp !== null && !isMutedRef.current) {
      try {
        soundsRef.current.levelUp.play();
      } catch (error) {
        console.error('Error playing level up sound:', error);
      }
    }
  }, []);

  const playGameOverSound = useCallback((): void => {
    if (soundsRef.current.gameOver !== null && !isMutedRef.current) {
      try {
        soundsRef.current.gameOver.play();
      } catch (error) {
        console.error('Error playing game over sound:', error);
      }
    }
  }, []);

  const startBackgroundMusic = useCallback((): void => {
    if (soundsRef.current.background !== null && !isMutedRef.current) {
      try {
        soundsRef.current.background.play();
      } catch (error) {
        console.error('Error starting background music:', error);
      }
    }
  }, []);

  const stopBackgroundMusic = useCallback((): void => {
    if (soundsRef.current.background !== null) {
      soundsRef.current.background.stop();
    }
  }, []);

  const setMuted = useCallback((muted: boolean): void => {
    isMutedRef.current = muted;
    if (muted && soundsRef.current.background !== null) {
      soundsRef.current.background.pause();
    } else if (!muted && soundsRef.current.background !== null) {
      soundsRef.current.background.play();
    }
  }, []);

  const setVolume = useCallback((volume: number): void => {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    volumeRef.current = clampedVolume;
    
    // Update volume for all sounds, preserving their original relative volumes
    if (soundsRef.current.hit !== null) {
      soundsRef.current.hit.volume(originalVolumesRef.current.hit * clampedVolume);
    }
    if (soundsRef.current.combo !== null) {
      soundsRef.current.combo.volume(originalVolumesRef.current.combo * clampedVolume);
    }
    if (soundsRef.current.levelUp !== null) {
      soundsRef.current.levelUp.volume(originalVolumesRef.current.levelUp * clampedVolume);
    }
    if (soundsRef.current.gameOver !== null) {
      soundsRef.current.gameOver.volume(originalVolumesRef.current.gameOver * clampedVolume);
    }
    if (soundsRef.current.background !== null) {
      soundsRef.current.background.volume(originalVolumesRef.current.background * clampedVolume);
    }
  }, []);

  const getVolume = useCallback((): number => {
    return volumeRef.current;
  }, []);

  return {
    playHitSound,
    playComboSound,
    playLevelUpSound,
    playGameOverSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    setMuted,
    setVolume,
    getVolume,
  };
}

/**
 * Get AudioContext constructor (handles browser compatibility)
 */
function getAudioContext(): typeof AudioContext {
  return window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
}

/**
 * Generate a simple tone as a data URL for use with Howler
 * @param frequency - Frequency in Hz
 * @param duration - Duration in seconds
 * @param amplitude - Amplitude multiplier (0-1)
 * @returns Data URL containing the audio
 */
function generateToneDataURL(frequency: number, duration: number, amplitude = 0.5): string {
  // Create an AudioContext
  const AudioContextConstructor = getAudioContext();
  const audioContext = new AudioContextConstructor();
  const sampleRate = audioContext.sampleRate;
  const numSamples = Math.floor(sampleRate * duration);

  // Create a buffer
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  // Cache angular frequency multipliers for performance
  const omega = 2 * Math.PI * frequency;
  const omega2 = omega * 2;
  const omega3 = omega * 3;

  // Generate a sine wave with envelope and harmonics for richer sound
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Apply ADSR envelope (attack-decay-sustain-release)
    const attack = 0.02;
    const decay = 0.1;
    const sustain = 0.7;
    const release = 0.2;
    
    let envelope;
    if (t < attack) {
      envelope = t / attack;
    } else if (t < attack + decay) {
      envelope = 1 - ((t - attack) / decay) * (1 - sustain);
    } else if (t < duration - release) {
      envelope = sustain;
    } else {
      envelope = sustain * (1 - (t - (duration - release)) / release);
    }
    
    // Add fundamental and harmonics for richer sound
    const fundamental = Math.sin(omega * t);
    const harmonic2 = Math.sin(omega2 * t) * 0.3;
    const harmonic3 = Math.sin(omega3 * t) * 0.15;
    
    channelData[i] = (fundamental + harmonic2 + harmonic3) * envelope * amplitude;
  }

  // Convert buffer to WAV format data URL
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([wav], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

/**
 * Convert AudioBuffer to WAV format
 * @param buffer - AudioBuffer to convert
 * @returns ArrayBuffer containing WAV data
 */
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const data = interleave(buffer);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  // Write audio data
  floatTo16BitPCM(view, 44, data);

  return arrayBuffer;
}

/**
 * Interleave audio channels
 */
function interleave(buffer: AudioBuffer): Float32Array {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels;
  const result = new Float32Array(length);

  let offset = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = buffer.getChannelData(channel)[i];
      if (sample !== undefined) {
        result[offset] = sample;
      }
      offset++;
    }
  }

  return result;
}

/**
 * Write string to DataView
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Convert float samples to 16-bit PCM
 */
function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array): void {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const sample = input[i];
    const s = Math.max(-1, Math.min(1, sample ?? 0));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

/**
 * Generate background music with melody, harmony, and rhythm
 * Creates an upbeat electronic game music loop
 * @returns Data URL containing the music
 */
function generateBackgroundMusic(): string {
  const AudioContextConstructor = getAudioContext();
  const audioContext = new AudioContextConstructor();
  const sampleRate = audioContext.sampleRate;
  const duration = 8; // 8 second loop for variety
  const numSamples = Math.floor(sampleRate * duration);
  
  const buffer = audioContext.createBuffer(2, numSamples, sampleRate); // Stereo
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  
  const bpm = 140; // Beats per minute - upbeat tempo
  const beatDuration = 60 / bpm;
  
  // Musical scale: A minor pentatonic (A, C, D, E, G) - commonly used in game music
  const baseFreq = 220; // A3
  const scale = [
    baseFreq * 1.0,        // A
    baseFreq * 1.189,      // C (6/5 ratio)
    baseFreq * 1.335,      // D (4/3 ratio)
    baseFreq * 1.5,        // E (3/2 ratio)
    baseFreq * 1.682,      // G (27/16 ratio)
    baseFreq * 2.0,        // A octave
  ];
  
  // Melody pattern (note indices in scale)
  const melodyPattern = [0, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 1, 0, -1];
  
  // Bass pattern (simpler, lower octave)
  const bassPattern = [0, 0, 3, 3, 0, 0, 4, 4];
  
  // Generate music
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const beatPos = (t / beatDuration) % 16; // Position in 16-beat loop
    const beatIndex = Math.floor(beatPos);
    
    // Bass line (left channel has more bass)
    const bassIndex = bassPattern[Math.floor(beatPos / 2) % bassPattern.length];
    const bassFreq = bassIndex !== undefined ? (scale[bassIndex] ?? baseFreq) / 2 : baseFreq / 2; // One octave down
    const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.3;
    
    // Add sub-bass for depth
    const subBass = Math.sin(2 * Math.PI * (bassFreq / 2) * t) * 0.2;
    
    // Melody line (eighth notes)
    const melodyIndex = melodyPattern[beatIndex % melodyPattern.length];
    let melody = 0;
    if (melodyIndex !== undefined && melodyIndex >= 0) {
      const melodyFreq = scale[melodyIndex] ?? baseFreq;
      // Add envelope to melody notes
      const notePhase = (beatPos % 1);
      const envelope = Math.exp(-notePhase * 8); // Quick decay for plucky sound
      melody = Math.sin(2 * Math.PI * melodyFreq * t) * envelope * 0.25;
      
      // Add second harmonic for brightness
      melody += Math.sin(4 * Math.PI * melodyFreq * t) * envelope * 0.1;
    }
    
    // Pad/harmony (sustained chords)
    const chordRoot = scale[Math.floor(beatPos / 4) % 4] ?? baseFreq;
    const pad1 = Math.sin(2 * Math.PI * chordRoot * t) * 0.1;
    const pad2 = Math.sin(2 * Math.PI * chordRoot * 1.5 * t) * 0.08; // Fifth
    const pad3 = Math.sin(2 * Math.PI * chordRoot * 2 * t) * 0.06; // Octave
    
    // Hi-hat pattern (noise-based percussion)
    const hihat = (Math.random() - 0.5) * 0.05 * (beatPos % 0.5 < 0.05 ? 1 : 0);
    
    // Kick drum (sine wave with quick pitch drop)
    const kickTime = beatPos % 2; // Every 2 beats
    let kick = 0;
    if (kickTime < 0.15) {
      const kickFreq = 60 * (1 - kickTime / 0.15); // Pitch drops from 60Hz to 0
      kick = Math.sin(2 * Math.PI * kickFreq * kickTime) * Math.exp(-kickTime * 20) * 0.4;
    }
    
    // Mix everything together
    const leftMix = bass + subBass * 1.2 + melody * 0.9 + pad1 + pad2 + pad3 + hihat + kick;
    const rightMix = bass + subBass * 0.8 + melody * 1.1 + pad1 + pad2 + pad3 + hihat + kick;
    
    // Apply master volume and ensure no clipping
    leftChannel[i] = Math.max(-0.9, Math.min(0.9, leftMix * 0.6));
    rightChannel[i] = Math.max(-0.9, Math.min(0.9, rightMix * 0.6));
  }
  
  // Convert to WAV and return
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([wav], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

/**
 * Generate an ascending arpeggio for combo sound
 * Creates an exciting, rewarding sound for combos
 */
function generateArpeggioSound(): string {
  const AudioContextConstructor = getAudioContext();
  const audioContext = new AudioContextConstructor();
  const sampleRate = audioContext.sampleRate;
  const duration = 0.3;
  const numSamples = Math.floor(sampleRate * duration);
  
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Arpeggio: C5 -> E5 -> G5 -> C6 (major chord)
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const noteDuration = duration / notes.length;
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.min(Math.floor(t / noteDuration), notes.length - 1);
    const noteTime = t - noteIndex * noteDuration;
    const freq = notes[noteIndex] ?? 523.25;
    
    // Quick envelope for each note
    const envelope = Math.exp(-noteTime * 12);
    
    // Main tone with harmonics
    const fundamental = Math.sin(2 * Math.PI * freq * t);
    const harmonic = Math.sin(4 * Math.PI * freq * t) * 0.3;
    
    channelData[i] = (fundamental + harmonic) * envelope * 0.8;
  }
  
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([wav], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

/**
 * Generate a fanfare for level up sound
 * Creates a triumphant, celebratory sound
 */
function generateLevelUpSound(): string {
  const AudioContextConstructor = getAudioContext();
  const audioContext = new AudioContextConstructor();
  const sampleRate = audioContext.sampleRate;
  const duration = 0.5;
  const numSamples = Math.floor(sampleRate * duration);
  
  const buffer = audioContext.createBuffer(2, numSamples, sampleRate); // Stereo
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  
  // Triumphant major chord progression: C -> C major chord
  const root = 523.25; // C5
  const third = 659.25; // E5
  const fifth = 783.99; // G5
  const octave = 1046.5; // C6
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Envelope with sustain
    let envelope;
    if (t < 0.05) {
      envelope = t / 0.05;
    } else if (t < 0.35) {
      envelope = 1.0;
    } else {
      envelope = 1.0 - (t - 0.35) / 0.15;
    }
    
    // All notes play together as a chord
    const note1 = Math.sin(2 * Math.PI * root * t);
    const note2 = Math.sin(2 * Math.PI * third * t);
    const note3 = Math.sin(2 * Math.PI * fifth * t);
    const note4 = Math.sin(2 * Math.PI * octave * t) * 0.7;
    
    // Add brightness with harmonics
    const bright = Math.sin(2 * Math.PI * octave * 2 * t) * 0.3;
    
    const mix = (note1 + note2 + note3 + note4 + bright) * envelope * 0.25;
    
    leftChannel[i] = Math.max(-0.95, Math.min(0.95, mix));
    rightChannel[i] = Math.max(-0.95, Math.min(0.95, mix));
  }
  
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([wav], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}
