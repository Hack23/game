import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useGameState } from "./hooks/useGameState";

describe("useGameState Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.playerX).toBe(0);
    expect(result.current.gameState.playerY).toBe(0);
    expect(result.current.gameState.playerZ).toBe(0);
    expect(result.current.gameState.isPlaying).toBe(true);
    expect(result.current.gameState.timeLeft).toBe(60);
    expect(result.current.gameState.combo).toBe(0);
    expect(result.current.gameState.highScore).toBe(0);
    expect(result.current.gameState.targetSize).toBe(0.5);
    expect(result.current.gameState.level).toBe(1);
    expect(result.current.gameState.isNewHighScore).toBe(false);
  });

  it("initializes with custom values", () => {
    const { result } = renderHook(() =>
      useGameState({ score: 10, playerX: 5, isPlaying: false, timeLeft: 30 })
    );
    
    expect(result.current.gameState.score).toBe(10);
    expect(result.current.gameState.playerX).toBe(5);
    expect(result.current.gameState.isPlaying).toBe(false);
    expect(result.current.gameState.timeLeft).toBe(30);
  });

  it("increments score, combo, and randomizes position", () => {
    const { result } = renderHook(() => useGameState());
    
    const initialScore = result.current.gameState.score;
    const initialX = result.current.gameState.playerX;
    
    act(() => {
      result.current.incrementScore();
    });
    
    expect(result.current.gameState.score).toBe(initialScore + 1);
    expect(result.current.gameState.combo).toBe(1);
    // Position should be randomized (different from initial)
    expect(
      result.current.gameState.playerX !== initialX ||
      result.current.gameState.playerY !== 0 ||
      result.current.gameState.playerZ !== 0
    ).toBe(true);
  });

  it("increments score multiple times and builds combo", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore();
      result.current.incrementScore();
      result.current.incrementScore();
    });
    
    expect(result.current.gameState.score).toBe(3);
    expect(result.current.gameState.combo).toBe(3);
  });

  it("adds combo bonus points", () => {
    const { result } = renderHook(() => useGameState());
    
    // Score 5 times to trigger first combo bonus
    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.incrementScore();
      }
    });
    
    // At combo 5, should get 1 bonus point (5 base + 1 bonus = 6 total)
    expect(result.current.gameState.score).toBe(6);
    expect(result.current.gameState.combo).toBe(5);
  });

  it("increases level based on score", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      // Score 10 times to reach level 2
      for (let i = 0; i < 10; i++) {
        result.current.incrementScore();
      }
    });
    
    expect(result.current.gameState.level).toBe(2);
  });

  it("decreases target size as level increases", () => {
    const { result } = renderHook(() => useGameState());
    
    const initialSize = result.current.gameState.targetSize;
    
    act(() => {
      // Score enough to increase level
      for (let i = 0; i < 10; i++) {
        result.current.incrementScore();
      }
    });
    
    expect(result.current.gameState.targetSize).toBeLessThan(initialSize);
    expect(result.current.gameState.targetSize).toBeGreaterThanOrEqual(0.3); // Min size
  });

  it("resets combo after timeout", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore();
    });
    
    expect(result.current.gameState.combo).toBe(1);
    
    // Fast-forward time past combo timeout (2 seconds)
    act(() => {
      vi.advanceTimersByTime(2100);
    });
    
    expect(result.current.gameState.combo).toBe(0);
  });

  it("decrements time when playing", () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.timeLeft).toBe(60);
    expect(result.current.gameState.isPlaying).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.gameState.timeLeft).toBe(59);
  });

  it("stops game when time runs out", () => {
    const { result } = renderHook(() => useGameState({ timeLeft: 2 }));
    
    act(() => {
      result.current.incrementScore();
    });
    
    const score = result.current.gameState.score;
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.gameState.timeLeft).toBe(0);
    expect(result.current.gameState.isPlaying).toBe(false);
    expect(result.current.gameState.highScore).toBe(score);
    expect(result.current.gameState.isNewHighScore).toBe(true);
  });

  it("does not decrement time when paused", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.togglePause();
    });
    
    const timeBeforePause = result.current.gameState.timeLeft;
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.gameState.timeLeft).toBe(timeBeforePause);
  });

  it("resets game to initial state with preserved high score", () => {
    const { result } = renderHook(() => useGameState({ score: 10, timeLeft: 2 }));
    
    act(() => {
      result.current.incrementScore();
      result.current.incrementScore();
    });
    
    // Let time run out to set high score
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.gameState.isPlaying).toBe(false);
    const highScore = result.current.gameState.highScore;
    expect(highScore).toBeGreaterThan(0);
    expect(result.current.gameState.isNewHighScore).toBe(true);
    
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.playerX).toBe(0);
    expect(result.current.gameState.playerY).toBe(0);
    expect(result.current.gameState.playerZ).toBe(0);
    expect(result.current.gameState.isPlaying).toBe(true);
    expect(result.current.gameState.timeLeft).toBe(60);
    expect(result.current.gameState.combo).toBe(0);
    expect(result.current.gameState.highScore).toBe(highScore);
    expect(result.current.gameState.level).toBe(1);
    expect(result.current.gameState.targetSize).toBe(0.5);
    expect(result.current.gameState.isNewHighScore).toBe(false);
  });

  it("toggles pause state", () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.isPlaying).toBe(true);
    
    act(() => {
      result.current.togglePause();
    });
    
    expect(result.current.gameState.isPlaying).toBe(false);
    
    act(() => {
      result.current.togglePause();
    });
    
    expect(result.current.gameState.isPlaying).toBe(true);
  });

  it("maintains score when toggling pause", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore();
      result.current.incrementScore();
    });
    
    const scoreBeforePause = result.current.gameState.score;
    
    act(() => {
      result.current.togglePause();
    });
    
    expect(result.current.gameState.score).toBe(scoreBeforePause);
    expect(result.current.gameState.isPlaying).toBe(false);
  });

  it("randomizes player position within expected range on score increment", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore();
    });
    
    // Check that positions are within expected ranges
    expect(result.current.gameState.playerX).toBeGreaterThanOrEqual(-2);
    expect(result.current.gameState.playerX).toBeLessThanOrEqual(2);
    expect(result.current.gameState.playerY).toBeGreaterThanOrEqual(-1.5);
    expect(result.current.gameState.playerY).toBeLessThanOrEqual(1.5);
    expect(result.current.gameState.playerZ).toBeGreaterThanOrEqual(-1);
    expect(result.current.gameState.playerZ).toBeLessThanOrEqual(1);
  });
});
