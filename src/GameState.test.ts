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
    expect(result.current.gameState.isPlaying).toBe(true);
    expect(result.current.gameState.timeLeft).toBe(60);
    expect(result.current.gameState.combo).toBe(0);
    expect(result.current.gameState.highScore).toBe(0);
    expect(result.current.gameState.targetSize).toBe(0.5);
    expect(result.current.gameState.level).toBe(1);
    expect(result.current.gameState.isNewHighScore).toBe(false);
    expect(result.current.gameState.targets).toHaveLength(1);
    expect(result.current.gameState.totalClicks).toBe(0);
    expect(result.current.gameState.successfulHits).toBe(0);
  });

  it("initializes with custom values", () => {
    const { result } = renderHook(() =>
      useGameState({ score: 10, isPlaying: false, timeLeft: 30 })
    );
    
    expect(result.current.gameState.score).toBe(10);
    expect(result.current.gameState.isPlaying).toBe(false);
    expect(result.current.gameState.timeLeft).toBe(30);
  });

  it("increments score, combo, and updates targets", () => {
    const { result } = renderHook(() => useGameState());
    
    const initialScore = result.current.gameState.score;
    const initialTargetId = result.current.gameState.targets[0]?.id ?? 0;
    
    act(() => {
      result.current.incrementScore(initialTargetId);
    });
    
    expect(result.current.gameState.score).toBe(initialScore + 1);
    expect(result.current.gameState.combo).toBe(1);
    expect(result.current.gameState.successfulHits).toBe(1);
    expect(result.current.gameState.totalClicks).toBe(1);
    expect(result.current.gameState.targets).toHaveLength(1);
  });

  it("increments score multiple times and builds combo", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore(0);
      result.current.incrementScore(0);
      result.current.incrementScore(0);
    });
    
    expect(result.current.gameState.score).toBe(3);
    expect(result.current.gameState.combo).toBe(3);
  });

  it("adds combo bonus points", () => {
    const { result } = renderHook(() => useGameState());
    
    // Score 5 times to trigger first combo bonus
    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.incrementScore(0);
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
        result.current.incrementScore(0);
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
        result.current.incrementScore(0);
      }
    });
    
    expect(result.current.gameState.targetSize).toBeLessThan(initialSize);
    expect(result.current.gameState.targetSize).toBeGreaterThanOrEqual(0.3); // Min size
  });

  it("resets combo after timeout", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore(0);
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
      result.current.incrementScore(0);
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
      result.current.incrementScore(0);
      result.current.incrementScore(0);
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
      result.current.incrementScore(0);
      result.current.incrementScore(0);
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
    
    const firstTargetId = result.current.gameState.targets[0]?.id ?? 0;
    
    act(() => {
      result.current.incrementScore(firstTargetId);
    });
    
    // Check that new target positions are within expected ranges
    const firstTarget = result.current.gameState.targets[0];
    expect(firstTarget).toBeDefined();
    if (firstTarget) {
      expect(firstTarget.x).toBeGreaterThanOrEqual(-2);
      expect(firstTarget.x).toBeLessThanOrEqual(2);
      expect(firstTarget.y).toBeGreaterThanOrEqual(-1.5);
      expect(firstTarget.y).toBeLessThanOrEqual(1.5);
      expect(firstTarget.z).toBeGreaterThanOrEqual(-1);
      expect(firstTarget.z).toBeLessThanOrEqual(1);
    }
  });

  it("should track accuracy correctly", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore(0); // Hit
      result.current.recordMiss(); // Miss
      result.current.incrementScore(0); // Hit
    });
    
    expect(result.current.gameState.successfulHits).toBe(2);
    expect(result.current.gameState.totalClicks).toBe(3);
  });

  it("should break combo on miss", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore(0);
      result.current.incrementScore(0);
    });
    
    expect(result.current.gameState.combo).toBe(2);
    
    act(() => {
      result.current.recordMiss();
    });
    
    expect(result.current.gameState.combo).toBe(0);
  });

  it("should add multiple targets at higher levels", () => {
    const { result } = renderHook(() => useGameState());
    
    // Score until level 4 (10 points = level 2, 20 points = level 3, 30 points = level 4)
    act(() => {
      for (let i = 0; i < 30; i++) {
        result.current.incrementScore(result.current.gameState.targets[0]?.id ?? 0);
      }
    });
    
    expect(result.current.gameState.level).toBe(4);
    expect(result.current.gameState.targets.length).toBe(2);
  });

  it("should reach 3 targets at level 7", () => {
    const { result } = renderHook(() => useGameState());
    
    // Score until level 7 (60 points = level 7)
    act(() => {
      for (let i = 0; i < 60; i++) {
        const targetId = result.current.gameState.targets[0]?.id ?? 0;
        result.current.incrementScore(targetId);
      }
    });
    
    expect(result.current.gameState.level).toBeGreaterThanOrEqual(7);
    expect(result.current.gameState.targets.length).toBe(3);
  });

  it("should update all target sizes when level increases", () => {
    const { result } = renderHook(() => useGameState());
    
    const initialSize = result.current.gameState.targetSize;
    
    // Score enough to level up
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.incrementScore(result.current.gameState.targets[0]?.id ?? 0);
      }
    });
    
    const newSize = result.current.gameState.targetSize;
    expect(newSize).toBeLessThan(initialSize);
    
    // All targets should have the new size
    result.current.gameState.targets.forEach(target => {
      expect(target.size).toBe(newSize);
    });
  });

  it("should handle hitting different targets in multi-target mode", () => {
    const { result } = renderHook(() => useGameState());
    
    // Get to level 4 for 2 targets
    act(() => {
      for (let i = 0; i < 30; i++) {
        result.current.incrementScore(result.current.gameState.targets[0]?.id ?? 0);
      }
    });
    
    expect(result.current.gameState.targets.length).toBe(2);
    
    const target2Id = result.current.gameState.targets[1]?.id ?? 0;
    
    const initialScore = result.current.gameState.score;
    
    // Hit second target
    act(() => {
      result.current.incrementScore(target2Id);
    });
    
    expect(result.current.gameState.score).toBe(initialScore + 1);
    expect(result.current.gameState.successfulHits).toBeGreaterThan(0);
  });

  it("should maintain separate target IDs when spawning new targets", () => {
    const { result } = renderHook(() => useGameState());
    
    // Get to level 7 for 3 targets
    act(() => {
      for (let i = 0; i < 60; i++) {
        result.current.incrementScore(result.current.gameState.targets[0]?.id ?? 0);
      }
    });
    
    const targetIds = result.current.gameState.targets.map(t => t.id);
    const uniqueIds = new Set(targetIds);
    
    // All targets should have unique IDs
    expect(uniqueIds.size).toBe(targetIds.length);
  });
});
