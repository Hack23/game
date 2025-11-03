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
    // Create hit sound - short high-pitched beep
    soundsRef.current.hit = new Howl({
      src: [generateToneDataURL(440, 0.1)], // A4 note, 100ms
      volume: 0.3,
    });

    // Create combo sound - ascending tone
    soundsRef.current.combo = new Howl({
      src: [generateToneDataURL(880, 0.15)], // A5 note, 150ms
      volume: 0.4,
    });

    // Create level up sound - triumphant tone
    soundsRef.current.levelUp = new Howl({
      src: [generateToneDataURL(660, 0.3)], // E5 note, 300ms
      volume: 0.5,
    });

    // Create game over sound - descending tone
    soundsRef.current.gameOver = new Howl({
      src: [generateToneDataURL(220, 0.5)], // A3 note, 500ms
      volume: 0.4,
    });

    // Create background ambient sound - low frequency hum
    soundsRef.current.background = new Howl({
      src: [generateToneDataURL(110, 2)], // A2 note, 2s looped
      volume: 0.1,
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
 * @returns Data URL containing the audio
 */
function generateToneDataURL(frequency: number, duration: number): string {
  // Create an AudioContext
  const AudioContextConstructor = getAudioContext();
  const audioContext = new AudioContextConstructor();
  const sampleRate = audioContext.sampleRate;
  const numSamples = Math.floor(sampleRate * duration);

  // Create a buffer
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  // Generate a sine wave with envelope for smoother sound
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Apply ADSR envelope (simple fade in/out)
    const envelope = Math.min(1, t * 10) * Math.max(0, 1 - (t / duration) * 2);
    channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
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
