import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useAudioManager } from "./useAudioManager";

// Mock Howler
const mockPlay = vi.fn();
const mockStop = vi.fn();
const mockPause = vi.fn();
const mockUnload = vi.fn();

vi.mock("howler", () => {
  class MockHowl {
    play = mockPlay;
    stop = mockStop;
    pause = mockPause;
    unload = mockUnload;
  }
  
  return {
    Howl: MockHowl,
  };
});

// Mock AudioContext
vi.mock("./useAudioManager", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./useAudioManager")>();
  return {
    ...actual,
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

    expect(typeof result.current.playHitSound).toBe("function");
    expect(typeof result.current.playComboSound).toBe("function");
    expect(typeof result.current.playLevelUpSound).toBe("function");
    expect(typeof result.current.playGameOverSound).toBe("function");
    expect(typeof result.current.startBackgroundMusic).toBe("function");
    expect(typeof result.current.stopBackgroundMusic).toBe("function");
    expect(typeof result.current.setMuted).toBe("function");
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
    };

    rerender();

    expect(result.current.playHitSound).toBe(initialFunctions.playHitSound);
    expect(result.current.playComboSound).toBe(initialFunctions.playComboSound);
    expect(result.current.playLevelUpSound).toBe(initialFunctions.playLevelUpSound);
    expect(result.current.playGameOverSound).toBe(initialFunctions.playGameOverSound);
    expect(result.current.startBackgroundMusic).toBe(initialFunctions.startBackgroundMusic);
    expect(result.current.stopBackgroundMusic).toBe(initialFunctions.stopBackgroundMusic);
    expect(result.current.setMuted).toBe(initialFunctions.setMuted);
  });
});
