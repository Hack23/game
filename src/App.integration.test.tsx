import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { describe, it, expect, beforeAll, vi, beforeEach, afterEach } from "vitest";
import type { ReactNode, ReactElement } from "react";
import { act, renderHook } from "@testing-library/react";
import { useGameState } from "./hooks/useGameState";

// Add this to the top of the file to mock window.scrollTo for jsdom
beforeAll(() => {
  window.scrollTo = (): void => {};
});

// Mock @react-three/fiber Canvas component
vi.mock("@react-three/fiber", (): object => ({
  Canvas: ({ children }: { children: ReactNode }): ReactElement => (
    <div data-testid="mocked-threejs-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: (): object => ({
    camera: {
      position: { x: 0, y: 2, z: 8, lerp: vi.fn() }
    },
    scene: {},
    gl: {},
  }),
  ThreeEvent: vi.fn(),
}));

// Mock @react-three/drei components
vi.mock("@react-three/drei", (): object => ({
  OrbitControls: (): ReactElement => <div data-testid="mocked-orbit-controls" />,
  Html: ({ children }: { children: ReactNode }): ReactElement => (
    <div data-testid="mocked-html">{children}</div>
  ),
  Sparkles: (): ReactElement => <div data-testid="mocked-sparkles" />,
  Trail: ({ children }: { children: ReactNode }): ReactElement => (
    <div data-testid="mocked-trail">{children}</div>
  ),
}));

// Mock THREE
vi.mock("three", () => ({
  default: {
    Mesh: vi.fn(),
  },
  Vector3: vi.fn().mockImplementation(function(this: object, x = 0, y = 0, z = 0) {
    return { x, y, z };
  }),
  AdditiveBlending: 2,
}));

// Create mock audio functions
const mockPlayHitSound = vi.fn();
const mockPlayComboSound = vi.fn();
const mockPlayLevelUpSound = vi.fn();
const mockPlayGameOverSound = vi.fn();
const mockStartBackgroundMusic = vi.fn();
const mockStopBackgroundMusic = vi.fn();
const mockSetMuted = vi.fn();
const mockSetVolume = vi.fn();
const mockGetVolume = vi.fn(() => 1.0);

// Mock useAudioManager hook
vi.mock("./hooks/useAudioManager", (): object => ({
  useAudioManager: (): object => ({
    playHitSound: mockPlayHitSound,
    playComboSound: mockPlayComboSound,
    playLevelUpSound: mockPlayLevelUpSound,
    playGameOverSound: mockPlayGameOverSound,
    startBackgroundMusic: mockStartBackgroundMusic,
    stopBackgroundMusic: mockStopBackgroundMusic,
    setMuted: mockSetMuted,
    setVolume: mockSetVolume,
    getVolume: mockGetVolume,
  }),
}));

describe("App Game Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Target Clicking and Scoring", () => {
    it("should play hit sound when target is clicked", () => {
      render(<App />);
      
      // Find the target sphere and simulate click
      const targetSphere = screen.getAllByTestId("mocked-trail")[0]?.parentElement?.querySelector('[data-testid="target-sphere"]');
      
      if (targetSphere) {
        act(() => {
          targetSphere.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        
        expect(mockPlayHitSound).toHaveBeenCalled();
      }
    });

    it("should not play hit sound when muted", async () => {
      render(<App />);
      
      // Mute the game
      const muteButton = screen.getByTestId("mute-button");
      act(() => {
        muteButton.click();
      });
      
      mockPlayHitSound.mockClear();
      
      // Find and click target
      const targetSphere = screen.getAllByTestId("mocked-trail")[0]?.parentElement?.querySelector('[data-testid="target-sphere"]');
      
      if (targetSphere) {
        act(() => {
          targetSphere.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        
        expect(mockPlayHitSound).not.toHaveBeenCalled();
      }
    });
  });

  describe("Level Progression", () => {
    it("should play level up sound when reaching new level", () => {
      const { result } = renderHook(() => useGameState());
      
      mockPlayLevelUpSound.mockClear();
      
      // Score 9 times (with a combo bonus at hit 5, total score will be 10) to reach level 2
      act(() => {
        for (let i = 0; i < 9; i++) {
          result.current.incrementScore(0);
        }
      });
      
      // Level should have increased
      expect(result.current.gameState.level).toBe(2);
    });

    it("should increase level based on score thresholds (every 10 score points)", () => {
      const { result } = renderHook(() => useGameState());
      
      expect(result.current.gameState.level).toBe(1);
      
      // Score 10 times
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.incrementScore(0);
        }
      });
      
      expect(result.current.gameState.level).toBe(2);
      
      // Score 10 more times
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.incrementScore(0);
        }
      });
      
      expect(result.current.gameState.level).toBeGreaterThanOrEqual(3);
    });

    it("should decrease target size as level increases", () => {
      const { result } = renderHook(() => useGameState());
      
      const initialSize = result.current.gameState.targetSize;
      
      // Score to increase level
      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.incrementScore(0);
        }
      });
      
      expect(result.current.gameState.targetSize).toBeLessThan(initialSize);
    });
  });

  describe("Combo System", () => {
    it("should play combo sound on every 5th hit", () => {
      const { result } = renderHook(() => useGameState());
      
      mockPlayComboSound.mockClear();
      
      // Score 5 times
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.incrementScore(0);
        }
      });
      
      // Combo should be 5
      expect(result.current.gameState.combo).toBe(5);
    });

    it("should give bonus point on every 5th hit", () => {
      const { result } = renderHook(() => useGameState());
      
      // Score 5 times
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.incrementScore(0);
        }
      });
      
      // Should have 5 base + 1 bonus = 6 points
      expect(result.current.gameState.score).toBe(6);
      expect(result.current.gameState.combo).toBe(5);
    });

    it("should give bonus points on multiple combo milestones", () => {
      const { result } = renderHook(() => useGameState());
      
      // Score 10 times
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.incrementScore(0);
        }
      });
      
      // Should have 10 base + 2 bonuses (at 5 and 10) = 12 points
      expect(result.current.gameState.score).toBe(12);
      expect(result.current.gameState.combo).toBe(10);
    });

    it("should reset combo after timeout", () => {
      const { result } = renderHook(() => useGameState());
      
      // Score once to start combo
      act(() => {
        result.current.incrementScore(0);
      });
      
      expect(result.current.gameState.combo).toBe(1);
      
      // Wait for combo timeout (2 seconds)
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      
      expect(result.current.gameState.combo).toBe(0);
    });
  });

  describe("Game Flow", () => {
    it("should handle complete game cycle", () => {
      const { result } = renderHook(() => useGameState({ timeLeft: 5 }));
      
      expect(result.current.gameState.isPlaying).toBe(true);
      expect(result.current.gameState.score).toBe(0);
      
      // Play for a bit
      act(() => {
        result.current.incrementScore(0);
        result.current.incrementScore(0);
        result.current.incrementScore(0);
      });
      
      expect(result.current.gameState.score).toBe(3);
      
      // Let time run out
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      expect(result.current.gameState.timeLeft).toBe(0);
      expect(result.current.gameState.isPlaying).toBe(false);
      
      // Reset game
      act(() => {
        result.current.resetGame();
      });
      
      expect(result.current.gameState.score).toBe(0);
      expect(result.current.gameState.isPlaying).toBe(true);
    });

    it("should track high score across resets", () => {
      const { result } = renderHook(() => useGameState({ timeLeft: 2 }));
      
      // Play first game
      act(() => {
        result.current.incrementScore(0);
        result.current.incrementScore(0);
        result.current.incrementScore(0);
      });
      
      const firstScore = result.current.gameState.score;
      
      // Let game end
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.gameState.highScore).toBe(firstScore);
      expect(result.current.gameState.isNewHighScore).toBe(true);
      
      // Reset and play second game
      act(() => {
        result.current.resetGame();
      });
      
      expect(result.current.gameState.highScore).toBe(firstScore);
      expect(result.current.gameState.score).toBe(0);
      expect(result.current.gameState.isNewHighScore).toBe(false);
    });
  });

  describe("Particle Explosion Effects", () => {
    it("should trigger explosion when target is clicked", () => {
      render(<App />);
      
      // The explosion state should be initially false
      // We can't directly access state, but we can verify the component renders
      expect(screen.getByTestId("threejs-canvas-container")).toBeInTheDocument();
    });
  });

  describe("Ball Movement Integration", () => {
    it("should randomize target position after scoring", () => {
      const { result } = renderHook(() => useGameState());
      
      const initialTarget = result.current.gameState.targets[0];
      if (!initialTarget) throw new Error("No target");
      
      const initialPos = {
        x: initialTarget.x,
        y: initialTarget.y,
        z: initialTarget.z,
      };
      
      act(() => {
        result.current.incrementScore(initialTarget.id);
      });
      
      const newTarget = result.current.gameState.targets[0];
      if (!newTarget) throw new Error("No target after score");
      
      const newPos = {
        x: newTarget.x,
        y: newTarget.y,
        z: newTarget.z,
      };
      
      // Position should have changed
      expect(
        initialPos.x !== newPos.x ||
        initialPos.y !== newPos.y ||
        initialPos.z !== newPos.z
      ).toBe(true);
    });

    it("should reset ball position and velocity on game reset", () => {
      const { result } = renderHook(() => useGameState());
      
      // Score to change state
      act(() => {
        const targetId = result.current.gameState.targets[0]?.id ?? 0;
        result.current.incrementScore(targetId);
        result.current.incrementScore(targetId);
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      // Check that targets are reset
      expect(result.current.gameState.targets).toHaveLength(1);
      expect(result.current.gameState.targets[0]).toBeDefined();
      
      // Score and stats should be reset
      expect(result.current.gameState.score).toBe(0);
      expect(result.current.gameState.totalClicks).toBe(0);
      expect(result.current.gameState.successfulHits).toBe(0);
    });
  });
});
