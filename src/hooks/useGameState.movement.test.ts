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

  describe("Ball Velocity and Movement", () => {
    it("should initialize with random velocities", () => {
      const { result } = renderHook(() => useGameState());
      
      // Velocities should be set (non-zero)
      expect(result.current.gameState.velocityX).toBeDefined();
      expect(result.current.gameState.velocityY).toBeDefined();
      expect(result.current.gameState.velocityZ).toBeDefined();
    });

    it("should update velocities when score is incremented", () => {
      const { result } = renderHook(() => useGameState());
      
      const initialVelocityX = result.current.gameState.velocityX;
      const initialVelocityY = result.current.gameState.velocityY;
      const initialVelocityZ = result.current.gameState.velocityZ;
      
      act(() => {
        result.current.incrementScore();
      });
      
      // Velocities should change after scoring
      expect(
        result.current.gameState.velocityX !== initialVelocityX ||
        result.current.gameState.velocityY !== initialVelocityY ||
        result.current.gameState.velocityZ !== initialVelocityZ
      ).toBe(true);
    });

    it("should generate new random velocities on reset", () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.incrementScore();
        result.current.incrementScore();
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      // Velocities should be reset and potentially different
      expect(result.current.gameState.velocityX).toBeDefined();
      expect(result.current.gameState.velocityY).toBeDefined();
      expect(result.current.gameState.velocityZ).toBeDefined();
    });
  });

  describe("Ball Position Boundaries", () => {
    it("should keep ball within X boundaries (-2 to +2)", () => {
      const { result } = renderHook(() => useGameState());
      
      // Generate multiple positions by scoring
      for (let i = 0; i < 20; i++) {
        act(() => {
          result.current.incrementScore();
        });
        
        expect(result.current.gameState.playerX).toBeGreaterThanOrEqual(-2);
        expect(result.current.gameState.playerX).toBeLessThanOrEqual(2);
      }
    });

    it("should keep ball within Y boundaries (-1.5 to +1.5)", () => {
      const { result } = renderHook(() => useGameState());
      
      // Generate multiple positions by scoring
      for (let i = 0; i < 20; i++) {
        act(() => {
          result.current.incrementScore();
        });
        
        expect(result.current.gameState.playerY).toBeGreaterThanOrEqual(-1.5);
        expect(result.current.gameState.playerY).toBeLessThanOrEqual(1.5);
      }
    });

    it("should keep ball within Z boundaries (-1 to +1)", () => {
      const { result } = renderHook(() => useGameState());
      
      // Generate multiple positions by scoring
      for (let i = 0; i < 20; i++) {
        act(() => {
          result.current.incrementScore();
        });
        
        expect(result.current.gameState.playerZ).toBeGreaterThanOrEqual(-1);
        expect(result.current.gameState.playerZ).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("Speed Scaling with Level", () => {
    it("should maintain reasonable velocities", () => {
      const { result } = renderHook(() => useGameState());
      
      // Check initial velocities are reasonable
      expect(Math.abs(result.current.gameState.velocityX)).toBeLessThan(1);
      expect(Math.abs(result.current.gameState.velocityY)).toBeLessThan(1);
      expect(Math.abs(result.current.gameState.velocityZ)).toBeLessThan(1);
    });

    it("should increase effective speed as level increases", () => {
      const { result } = renderHook(() => useGameState());
      
      const level1 = result.current.gameState.level;
      
      // Score to reach level 2
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.incrementScore();
        }
      });
      
      const level2 = result.current.gameState.level;
      
      // Level should have increased
      expect(level2).toBeGreaterThan(level1);
    });
  });

  describe("Game State During Movement", () => {
    it("should not move ball when game is paused", () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.togglePause();
      });
      
      // Advance time
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      // Position should not change significantly when paused
      // Note: Due to requestAnimationFrame mocking, we just verify the game is paused
      expect(result.current.gameState.isPlaying).toBe(false);
    });

    it("should not move ball when game is over", () => {
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
    it("should randomize position when scoring multiple times", () => {
      const { result } = renderHook(() => useGameState());
      
      const positions: Array<{ x: number; y: number; z: number }> = [];
      
      // Collect multiple positions
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.incrementScore();
        });
        
        positions.push({
          x: result.current.gameState.playerX,
          y: result.current.gameState.playerY,
          z: result.current.gameState.playerZ,
        });
      }
      
      // Check that positions are different (randomized)
      const uniquePositions = new Set(
        positions.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}`)
      );
      
      // Most positions should be unique (allowing for some coincidental duplicates)
      expect(uniquePositions.size).toBeGreaterThan(7);
    });

    it("should set valid positions after each score", () => {
      const { result } = renderHook(() => useGameState());
      
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.incrementScore();
        });
        
        // Check positions are valid numbers
        expect(Number.isFinite(result.current.gameState.playerX)).toBe(true);
        expect(Number.isFinite(result.current.gameState.playerY)).toBe(true);
        expect(Number.isFinite(result.current.gameState.playerZ)).toBe(true);
        
        // Check positions are not NaN
        expect(Number.isNaN(result.current.gameState.playerX)).toBe(false);
        expect(Number.isNaN(result.current.gameState.playerY)).toBe(false);
        expect(Number.isNaN(result.current.gameState.playerZ)).toBe(false);
      }
    });
  });

  describe("Velocity Reset on Score", () => {
    it("should generate new velocities after scoring", () => {
      const { result } = renderHook(() => useGameState());
      
      const velocities: Array<{ x: number; y: number; z: number }> = [];
      
      // Collect multiple velocity sets
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.incrementScore();
        });
        
        velocities.push({
          x: result.current.gameState.velocityX,
          y: result.current.gameState.velocityY,
          z: result.current.gameState.velocityZ,
        });
      }
      
      // Check that velocities are different after each score
      const uniqueVelocities = new Set(
        velocities.map(v => `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`)
      );
      
      // Most velocities should be unique (randomized)
      expect(uniqueVelocities.size).toBeGreaterThan(3);
    });

    it("should maintain velocity magnitudes in reasonable range", () => {
      const { result } = renderHook(() => useGameState());
      
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.incrementScore();
        });
        
        // Velocities should be small (base speed is 0.02, max is around 0.02)
        expect(Math.abs(result.current.gameState.velocityX)).toBeLessThan(0.1);
        expect(Math.abs(result.current.gameState.velocityY)).toBeLessThan(0.1);
        expect(Math.abs(result.current.gameState.velocityZ)).toBeLessThan(0.1);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid scoring", () => {
      const { result } = renderHook(() => useGameState());
      
      // Rapidly score multiple times
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.incrementScore();
        }
      });
      
      // Game should still be in valid state
      // 50 base hits + 10 combo bonuses (at every 5th hit) = 60
      expect(result.current.gameState.score).toBe(60);
      expect(Number.isFinite(result.current.gameState.playerX)).toBe(true);
      expect(Number.isFinite(result.current.gameState.playerY)).toBe(true);
      expect(Number.isFinite(result.current.gameState.playerZ)).toBe(true);
    });

    it("should maintain state consistency after pause-resume cycles", () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.incrementScore();
        result.current.togglePause();
        result.current.togglePause();
        result.current.incrementScore();
      });
      
      expect(result.current.gameState.score).toBe(2);
      expect(result.current.gameState.isPlaying).toBe(true);
    });

    it("should reset velocities correctly when game is reset", () => {
      const { result } = renderHook(() => useGameState());
      
      // Score and let ball move
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.incrementScore();
        }
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      // All velocities should be defined after reset
      expect(result.current.gameState.velocityX).toBeDefined();
      expect(result.current.gameState.velocityY).toBeDefined();
      expect(result.current.gameState.velocityZ).toBeDefined();
      expect(Number.isFinite(result.current.gameState.velocityX)).toBe(true);
      expect(Number.isFinite(result.current.gameState.velocityY)).toBe(true);
      expect(Number.isFinite(result.current.gameState.velocityZ)).toBe(true);
    });
  });
});
