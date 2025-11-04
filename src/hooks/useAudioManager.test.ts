import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useAudioManager } from "./useAudioManager";

// Mock Howler
const mockPlay = vi.fn();
const mockStop = vi.fn();
const mockPause = vi.fn();
const mockUnload = vi.fn();
const mockVolume = vi.fn();

vi.mock("howler", () => {
  class MockHowl {
    play = mockPlay;
    stop = mockStop;
    pause = mockPause;
    unload = mockUnload;
    volume = mockVolume;
  }
  
  return {
    Howl: MockHowl,
  };
});

// Setup global mocks
const mockCreateBuffer = vi.fn().mockReturnValue({
  numberOfChannels: 1,
  length: 48000,
  sampleRate: 48000,
  getChannelData: vi.fn().mockReturnValue(new Float32Array(48000)),
});

class MockAudioContext {
  createBuffer = mockCreateBuffer;
  sampleRate = 48000;
}

global.AudioContext = MockAudioContext as unknown as typeof AudioContext;
global.URL.createObjectURL = vi.fn().mockReturnValue("mock-blob-url");

describe("useAudioManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("should initialize audio manager with all functions", () => {
    const { result } = renderHook(() => useAudioManager());

    expect(result.current).toHaveProperty("playHitSound");
    expect(result.current).toHaveProperty("playComboSound");
    expect(result.current).toHaveProperty("playLevelUpSound");
    expect(result.current).toHaveProperty("playGameOverSound");
    expect(result.current).toHaveProperty("startBackgroundMusic");
    expect(result.current).toHaveProperty("stopBackgroundMusic");
    expect(result.current).toHaveProperty("setMuted");
    expect(result.current).toHaveProperty("setVolume");
    expect(result.current).toHaveProperty("getVolume");

    expect(typeof result.current.playHitSound).toBe("function");
    expect(typeof result.current.playComboSound).toBe("function");
    expect(typeof result.current.playLevelUpSound).toBe("function");
    expect(typeof result.current.playGameOverSound).toBe("function");
    expect(typeof result.current.startBackgroundMusic).toBe("function");
    expect(typeof result.current.stopBackgroundMusic).toBe("function");
    expect(typeof result.current.setMuted).toBe("function");
    expect(typeof result.current.setVolume).toBe("function");
    expect(typeof result.current.getVolume).toBe("function");
  });

  it("should play hit sound when not muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.playHitSound();
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should play combo sound when not muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.playComboSound();
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should play level up sound when not muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.playLevelUpSound();
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should play game over sound when not muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.playGameOverSound();
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should start background music when not muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.startBackgroundMusic();
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should stop background music", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.stopBackgroundMusic();
    });

    expect(mockStop).toHaveBeenCalled();
  });

  it("should not play hit sound when muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    mockPlay.mockClear();

    act(() => {
      result.current.playHitSound();
    });

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it("should not play combo sound when muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    mockPlay.mockClear();

    act(() => {
      result.current.playComboSound();
    });

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it("should not play level up sound when muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    mockPlay.mockClear();

    act(() => {
      result.current.playLevelUpSound();
    });

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it("should not play game over sound when muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    mockPlay.mockClear();

    act(() => {
      result.current.playGameOverSound();
    });

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it("should pause background music when muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    expect(mockPause).toHaveBeenCalled();
  });

  it("should resume background music when unmuted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    mockPlay.mockClear();
    mockPause.mockClear();

    act(() => {
      result.current.setMuted(false);
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should not start background music when muted", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    mockPlay.mockClear();

    act(() => {
      result.current.startBackgroundMusic();
    });

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it("should unload all sounds on unmount", () => {
    const { unmount } = renderHook(() => useAudioManager());

    unmount();

    // Should unload 5 sounds (hit, combo, levelUp, gameOver, background)
    expect(mockUnload).toHaveBeenCalledTimes(5);
  });

  it("should toggle mute state correctly", () => {
    const { result } = renderHook(() => useAudioManager());

    // Start unmuted
    mockPlay.mockClear();
    act(() => {
      result.current.playHitSound();
    });
    expect(mockPlay).toHaveBeenCalled();

    // Mute
    mockPlay.mockClear();
    act(() => {
      result.current.setMuted(true);
    });

    act(() => {
      result.current.playHitSound();
    });
    expect(mockPlay).not.toHaveBeenCalled();

    // Unmute
    mockPlay.mockClear();
    act(() => {
      result.current.setMuted(false);
    });

    act(() => {
      result.current.playHitSound();
    });
    expect(mockPlay).toHaveBeenCalled();
  });

  it("should maintain mute state across multiple sound plays", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setMuted(true);
    });

    mockPlay.mockClear();

    act(() => {
      result.current.playHitSound();
      result.current.playComboSound();
      result.current.playLevelUpSound();
    });

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it("should use stable function references", () => {
    const { result, rerender } = renderHook(() => useAudioManager());

    const initialFunctions = {
      playHitSound: result.current.playHitSound,
      playComboSound: result.current.playComboSound,
      playLevelUpSound: result.current.playLevelUpSound,
      playGameOverSound: result.current.playGameOverSound,
      startBackgroundMusic: result.current.startBackgroundMusic,
      stopBackgroundMusic: result.current.stopBackgroundMusic,
      setMuted: result.current.setMuted,
      setVolume: result.current.setVolume,
      getVolume: result.current.getVolume,
    };

    rerender();

    expect(result.current.playHitSound).toBe(initialFunctions.playHitSound);
    expect(result.current.playComboSound).toBe(initialFunctions.playComboSound);
    expect(result.current.playLevelUpSound).toBe(initialFunctions.playLevelUpSound);
    expect(result.current.playGameOverSound).toBe(initialFunctions.playGameOverSound);
    expect(result.current.startBackgroundMusic).toBe(initialFunctions.startBackgroundMusic);
    expect(result.current.stopBackgroundMusic).toBe(initialFunctions.stopBackgroundMusic);
    expect(result.current.setMuted).toBe(initialFunctions.setMuted);
    expect(result.current.setVolume).toBe(initialFunctions.setVolume);
    expect(result.current.getVolume).toBe(initialFunctions.getVolume);
  });

  it("should set and get volume correctly", () => {
    const { result } = renderHook(() => useAudioManager());

    expect(result.current.getVolume()).toBe(1.0);

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.getVolume()).toBe(0.5);
  });

  it("should clamp volume between 0 and 1", () => {
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.setVolume(1.5);
    });

    expect(result.current.getVolume()).toBe(1.0);

    act(() => {
      result.current.setVolume(-0.5);
    });

    expect(result.current.getVolume()).toBe(0.0);
  });

  it("should preserve volume hierarchy when setting master volume", () => {
    const { result } = renderHook(() => useAudioManager());

    // Clear the mocks from initialization
    mockVolume.mockClear();

    // Set master volume to 50%
    act(() => {
      result.current.setVolume(0.5);
    });

    // Verify that volume() was called 5 times (once for each sound)
    expect(mockVolume).toHaveBeenCalledTimes(5);
    
    // Verify that the original volume hierarchy is preserved
    // Original volumes: hit=0.7, combo=0.8, levelUp=0.85, gameOver=0.7, background=0.2
    // At 50% master volume: hit=0.35, combo=0.4, levelUp=0.425, gameOver=0.35, background=0.1
    expect(mockVolume).toHaveBeenNthCalledWith(1, 0.35); // hit: 0.7 * 0.5
    expect(mockVolume).toHaveBeenNthCalledWith(2, 0.4);  // combo: 0.8 * 0.5
    expect(mockVolume).toHaveBeenNthCalledWith(3, 0.425); // levelUp: 0.85 * 0.5
    expect(mockVolume).toHaveBeenNthCalledWith(4, 0.35); // gameOver: 0.7 * 0.5
    expect(mockVolume).toHaveBeenNthCalledWith(5, 0.1);  // background: 0.2 * 0.5
  });
});
