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

  const isMutedRef = useRef(false);

  // Generate simple tones using Web Audio API for game sounds
  useEffect(() => {
    // Create hit sound - punchy beep with harmonics
    soundsRef.current.hit = new Howl({
      src: [generateToneDataURL(880, 0.12, 0.8)], // A5 note, 120ms, louder
      volume: 0.7,
    });

    // Create combo sound - bright ascending tone
    soundsRef.current.combo = new Howl({
      src: [generateToneDataURL(1320, 0.2, 0.9)], // E6 note, 200ms
      volume: 0.8,
    });

    // Create level up sound - triumphant chord-like tone
    soundsRef.current.levelUp = new Howl({
      src: [generateToneDataURL(784, 0.4, 1)], // G5 note, 400ms
      volume: 0.85,
    });

    // Create game over sound - deep descending tone
    soundsRef.current.gameOver = new Howl({
      src: [generateToneDataURL(196, 0.6, 0.8)], // G3 note, 600ms
      volume: 0.7,
    });

    // Create background ambient sound - rhythmic pulse
    soundsRef.current.background = new Howl({
      src: [generateToneDataURL(110, 1.5, 0.4)], // A2 note, 1.5s looped
      volume: 0.2,
      loop: true,
    });

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
      soundsRef.current.hit.play();
    }
  }, []);

  const playComboSound = useCallback((): void => {
    if (soundsRef.current.combo !== null && !isMutedRef.current) {
      soundsRef.current.combo.play();
    }
  }, []);

  const playLevelUpSound = useCallback((): void => {
    if (soundsRef.current.levelUp !== null && !isMutedRef.current) {
      soundsRef.current.levelUp.play();
    }
  }, []);

  const playGameOverSound = useCallback((): void => {
    if (soundsRef.current.gameOver !== null && !isMutedRef.current) {
      soundsRef.current.gameOver.play();
    }
  }, []);

  const startBackgroundMusic = useCallback((): void => {
    if (soundsRef.current.background !== null && !isMutedRef.current) {
      soundsRef.current.background.play();
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

  return {
    playHitSound,
    playComboSound,
    playLevelUpSound,
    playGameOverSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    setMuted,
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
