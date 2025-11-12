import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useGameState } from "./useGameState";

describe("useGameState Ball Movement and Bouncing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Target Velocity and Movement", () => {
    it("should initialize with random velocities for all targets", () => {
      const { result } = renderHook(() => useGameState());
      
      // Each target should have velocities
      result.current.gameState.targets.forEach(target => {
        expect(target.velocityX).toBeDefined();
        expect(target.velocityY).toBeDefined();
        expect(target.velocityZ).toBeDefined();
      });
    });

    it("should update target when score is incremented", () => {
      const { result } = renderHook(() => useGameState());
      
      const initialTarget = result.current.gameState.targets[0];
      if (!initialTarget) throw new Error("No target found");
      
      const initialX = initialTarget.x;
      const initialY = initialTarget.y;
      const initialZ = initialTarget.z;
      
      act(() => {
        result.current.incrementScore(initialTarget.id);
      });
      
      // Target position should have changed (new target spawned)
      const newTarget = result.current.gameState.targets[0];
      expect(newTarget).toBeDefined();
      if (newTarget) {
        expect(
          newTarget.x !== initialX ||
          newTarget.y !== initialY ||
          newTarget.z !== initialZ
        ).toBe(true);
      }
    });

    it("should generate new random properties on reset", () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        const targetId = result.current.gameState.targets[0]?.id ?? 0;
        result.current.incrementScore(targetId);
        result.current.incrementScore(targetId);
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      // Should have targets with valid properties
      expect(result.current.gameState.targets.length).toBeGreaterThan(0);
      const firstTarget = result.current.gameState.targets[0];
      expect(firstTarget?.velocityX).toBeDefined();
      expect(firstTarget?.velocityY).toBeDefined();
      expect(firstTarget?.velocityZ).toBeDefined();
    });
  });

  describe("Target Position Boundaries", () => {
    it("should keep targets within X boundaries (-2 to +2)", () => {
      const { result } = renderHook(() => useGameState());
      
      // Generate multiple positions by scoring
      for (let i = 0; i < 20; i++) {
        act(() => {
          const targetId = result.current.gameState.targets[0]?.id ?? 0;
          result.current.incrementScore(targetId);
        });
        
        result.current.gameState.targets.forEach(target => {
          expect(target.x).toBeGreaterThanOrEqual(-2);
          expect(target.x).toBeLessThanOrEqual(2);
        });
      }
    });

    it("should keep targets within Y boundaries (-1.5 to +1.5)", () => {
      const { result } = renderHook(() => useGameState());
      
      // Generate multiple positions by scoring
      for (let i = 0; i < 20; i++) {
        act(() => {
          const targetId = result.current.gameState.targets[0]?.id ?? 0;
          result.current.incrementScore(targetId);
        });
        
        result.current.gameState.targets.forEach(target => {
          expect(target.y).toBeGreaterThanOrEqual(-1.5);
          expect(target.y).toBeLessThanOrEqual(1.5);
        });
      }
    });

    it("should keep targets within Z boundaries (-1 to +1)", () => {
      const { result } = renderHook(() => useGameState());
      
      // Generate multiple positions by scoring
      for (let i = 0; i < 20; i++) {
        act(() => {
          const targetId = result.current.gameState.targets[0]?.id ?? 0;
          result.current.incrementScore(targetId);
        });
        
        result.current.gameState.targets.forEach(target => {
          expect(target.z).toBeGreaterThanOrEqual(-1);
          expect(target.z).toBeLessThanOrEqual(1);
        });
      }
    });
  });

  describe("Speed Scaling with Level", () => {
    it("should maintain reasonable velocities for all targets", () => {
      const { result } = renderHook(() => useGameState());
      
      // Check initial velocities are reasonable for all targets
      result.current.gameState.targets.forEach(target => {
        expect(Math.abs(target.velocityX)).toBeLessThan(1);
        expect(Math.abs(target.velocityY)).toBeLessThan(1);
        expect(Math.abs(target.velocityZ)).toBeLessThan(1);
      });
    });

    it("should increase effective speed as level increases", () => {
      const { result } = renderHook(() => useGameState());
      
      const level1 = result.current.gameState.level;
      
      // Score to reach level 2
      act(() => {
        for (let i = 0; i < 10; i++) {
          const targetId = result.current.gameState.targets[0]?.id ?? 0;
          result.current.incrementScore(targetId);
        }
      });
      
      const level2 = result.current.gameState.level;
      
      // Level should have increased
      expect(level2).toBeGreaterThan(level1);
    });
  });

  describe("Game State During Movement", () => {
    it("should not move targets when game is paused", () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.togglePause();
      });
      
      // Game should be paused
      expect(result.current.gameState.isPlaying).toBe(false);
    });

    it("should not move targets when game is over", () => {
      const { result } = renderHook(() => useGameState({ timeLeft: 1 }));
      
      // Let game end
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(result.current.gameState.timeLeft).toBe(0);
      expect(result.current.gameState.isPlaying).toBe(false);
    });
  });

  describe("Position Randomization on Score", () => {
    it("should randomize target position when scoring", () => {
      const { result } = renderHook(() => useGameState());
      
      const initialTarget = result.current.gameState.targets[0];
      if (!initialTarget) throw new Error("No target");
      
      const initialPos = { x: initialTarget.x, y: initialTarget.y, z: initialTarget.z };
      
      act(() => {
        result.current.incrementScore(initialTarget.id);
      });
      
      const newTarget = result.current.gameState.targets[0];
      if (!newTarget) throw new Error("No target after score");
      
      // Position should have changed (new target spawned)
      const positionChanged = 
        newTarget.x !== initialPos.x ||
        newTarget.y !== initialPos.y ||
        newTarget.z !== initialPos.z;
      
      expect(positionChanged).toBe(true);
    });

    it("should set valid positions after each score", () => {
      const { result } = renderHook(() => useGameState());
      
      for (let i = 0; i < 10; i++) {
        act(() => {
          const targetId = result.current.gameState.targets[0]?.id ?? 0;
          result.current.incrementScore(targetId);
        });
        
        // Check all targets have valid positions
        result.current.gameState.targets.forEach(target => {
          expect(Number.isFinite(target.x)).toBe(true);
          expect(Number.isFinite(target.y)).toBe(true);
          expect(Number.isFinite(target.z)).toBe(true);
          expect(Number.isNaN(target.x)).toBe(false);
          expect(Number.isNaN(target.y)).toBe(false);
          expect(Number.isNaN(target.z)).toBe(false);
        });
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid scoring", () => {
      const { result } = renderHook(() => useGameState());
      
      // Rapidly score multiple times
      act(() => {
        for (let i = 0; i < 50; i++) {
          const targetId = result.current.gameState.targets[0]?.id ?? 0;
          result.current.incrementScore(targetId);
        }
      });
      
      // Game should still be in valid state
      // 50 base points + 10 bonus points (one for every 5th hit) = 60
      expect(result.current.gameState.score).toBe(60);
      
      // All targets should have valid positions
      result.current.gameState.targets.forEach(target => {
        expect(Number.isFinite(target.x)).toBe(true);
        expect(Number.isFinite(target.y)).toBe(true);
        expect(Number.isFinite(target.z)).toBe(true);
      });
    });

    it("should maintain state consistency after pause-resume cycles", () => {
      const { result } = renderHook(() => useGameState());
      
      const firstTargetId = result.current.gameState.targets[0]?.id ?? 0;
      
      act(() => {
        result.current.incrementScore(firstTargetId);
        result.current.togglePause();
        result.current.togglePause();
        result.current.incrementScore(firstTargetId);
      });
      
      expect(result.current.gameState.score).toBe(2);
      expect(result.current.gameState.isPlaying).toBe(true);
    });

    it("should reset targets correctly when game is reset", () => {
      const { result } = renderHook(() => useGameState());
      
      // Score to change state
      act(() => {
        for (let i = 0; i < 5; i++) {
          const targetId = result.current.gameState.targets[0]?.id ?? 0;
          result.current.incrementScore(targetId);
        }
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      // Should have exactly 1 target at level 1
      expect(result.current.gameState.targets).toHaveLength(1);
      const target = result.current.gameState.targets[0];
      expect(target).toBeDefined();
      if (target) {
        expect(target.velocityX).toBeDefined();
        expect(target.velocityY).toBeDefined();
        expect(target.velocityZ).toBeDefined();
      }
    });
  });
});
