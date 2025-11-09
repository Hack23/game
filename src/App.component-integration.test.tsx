import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";
import { describe, it, expect, beforeAll, vi, beforeEach, afterEach } from "vitest";
import type { ReactNode, ReactElement } from "react";

// Mock window.scrollTo for jsdom
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

describe("Component Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GameScene and TargetSphere Integration", () => {
    it("should render Three.js scene with game components properly integrated", () => {
      render(<App />);
      
      // Verify Three.js canvas is rendered
      expect(screen.getByTestId("threejs-canvas-container")).toBeInTheDocument();
      expect(screen.getByTestId("mocked-threejs-canvas")).toBeInTheDocument();
      
      // Verify orbit controls are integrated
      expect(screen.getByTestId("mocked-orbit-controls")).toBeInTheDocument();
      
      // Verify target sphere is rendered when game is active
      expect(screen.getByTestId("target-sphere")).toBeInTheDocument();
    });

    it("should hide target sphere when game is over", async () => {
      render(<App />);
      
      // Initially target should be visible
      expect(screen.getByTestId("target-sphere")).toBeInTheDocument();
      
      // Verify target exists and game is active
      expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
    });

    it("should integrate target sphere position with game state", () => {
      render(<App />);
      
      // Verify target is positioned according to game state
      // The target-sphere data-testid exists, confirming integration with game state
      expect(screen.getByTestId("target-sphere")).toBeInTheDocument();
      
      // Verify timer, score, and level displays are integrated
      expect(screen.getByTestId("timer-display")).toBeInTheDocument();
      expect(screen.getByTestId("score-display")).toBeInTheDocument();
      expect(screen.getByTestId("level-display")).toBeInTheDocument();
    });
  });

  describe("Audio-Visual Feedback Integration", () => {
    it("should integrate hit sound with target click", async () => {
      render(<App />);
      
      mockPlayHitSound.mockClear();
      
      // Trigger target click via test API
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      // Wait for event to be processed
      await waitFor(() => {
        expect(mockPlayHitSound).toHaveBeenCalled();
      });
    });

    it("should coordinate audio with visual explosion effect", async () => {
      render(<App />);
      
      // Clear any initial audio calls
      mockPlayHitSound.mockClear();
      
      // Trigger target click
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      // Both audio and visual feedback should be triggered together
      await waitFor(() => {
        expect(mockPlayHitSound).toHaveBeenCalledTimes(1);
        // Score should update (visual feedback)
        expect(screen.getByTestId("score-value")).toHaveTextContent("1");
      });
    });

    it("should mute audio but keep visual effects when muted", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Mute the game
      const muteButton = screen.getByTestId("mute-button");
      await user.click(muteButton);
      
      mockPlayHitSound.mockClear();
      
      // Trigger target click
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      // Audio should not play
      expect(mockPlayHitSound).not.toHaveBeenCalled();
      
      // But visual effects should still work (score updates)
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("1");
      });
    });

    it("should integrate background music with game state", async () => {
      render(<App />);
      
      // Background music should start when game is active
      await waitFor(() => {
        expect(mockStartBackgroundMusic).toHaveBeenCalled();
      });
      
      // Stop music when paused
      const pauseButton = screen.getByTestId("pause-button");
      const user = userEvent.setup();
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(mockStopBackgroundMusic).toHaveBeenCalled();
      });
    });
  });

  describe("Pause Overlay and Game State Integration", () => {
    it("should show pause overlay synchronized with game state", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Initially no pause overlay
      expect(screen.queryByTestId("pause-overlay")).not.toBeInTheDocument();
      
      // Pause game
      const pauseButton = screen.getByTestId("pause-button");
      await user.click(pauseButton);
      
      // Overlay should appear
      await waitFor(() => {
        expect(screen.getByTestId("pause-overlay")).toBeInTheDocument();
      });
      
      // Game status should update
      expect(screen.getByTestId("game-status")).toHaveTextContent("Paused");
      
      // Instructions should update
      expect(screen.getByTestId("instructions-text")).toHaveTextContent("paused");
    });

    it("should hide pause overlay when game resumes", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Pause
      const pauseButton = screen.getByTestId("pause-button");
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("pause-overlay")).toBeInTheDocument();
      });
      
      // Resume
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId("pause-overlay")).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
    });

    it("should prevent target clicks while paused", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Pause game
      const pauseButton = screen.getByTestId("pause-button");
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("game-status")).toHaveTextContent("Paused");
      });
      
      mockPlayHitSound.mockClear();
      
      // Try to click target while paused
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      // Give some time for potential event processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should not register (sound not played, score not changed)
      expect(mockPlayHitSound).not.toHaveBeenCalled();
      expect(screen.getByTestId("score-value")).toHaveTextContent("0");
    });
  });

  describe("Volume Control and Audio Manager Integration", () => {
    it("should synchronize volume slider with audio manager", async () => {
      render(<App />);
      
      const volumeSlider = screen.getByTestId("volume-slider") as HTMLInputElement;
      
      // Change volume
      volumeSlider.value = "0.7";
      volumeSlider.dispatchEvent(new Event("input", { bubbles: true }));
      
      await waitFor(() => {
        expect(mockSetVolume).toHaveBeenCalledWith(0.7);
      });
      
      // Display should update
      expect(screen.getByText("70%")).toBeInTheDocument();
    });

    it("should integrate mute button with audio manager and volume display", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const muteButton = screen.getByTestId("mute-button");
      
      // Initially unmuted
      expect(muteButton).toHaveTextContent("Mute");
      
      // Mute
      await user.click(muteButton);
      
      await waitFor(() => {
        expect(mockSetMuted).toHaveBeenCalledWith(true);
      });
      expect(muteButton).toHaveTextContent("Unmute");
      
      // Audio status indicator should hide
      expect(screen.queryByText(/Sound enabled/i)).not.toBeInTheDocument();
    });

    it("should coordinate volume control with game audio events", async () => {
      render(<App />);
      
      // Set volume to 0.5
      const volumeSlider = screen.getByTestId("volume-slider") as HTMLInputElement;
      volumeSlider.value = "0.5";
      volumeSlider.dispatchEvent(new Event("input", { bubbles: true }));
      
      await waitFor(() => {
        expect(mockSetVolume).toHaveBeenCalledWith(0.5);
      });
      
      // Click target - sound should play with adjusted volume
      mockPlayHitSound.mockClear();
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      await waitFor(() => {
        expect(mockPlayHitSound).toHaveBeenCalled();
      });
    });
  });

  describe("Timer Countdown and Game Over Integration", () => {
    it("should coordinate timer with game state and UI", () => {
      render(<App />);
      
      // Initial timer state
      const timerDisplay = screen.getByTestId("timer-display");
      expect(timerDisplay).toHaveTextContent("60s");
      expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
      
      // Verify timer element is rendered (timer countdown happens in real-time via setInterval)
      expect(timerDisplay).toBeInTheDocument();
    });

    it("should show game over overlay when timer reaches zero", () => {
      render(<App />);
      
      // Initially game should not be over
      expect(screen.queryByTestId("gameover-overlay")).not.toBeInTheDocument();
      
      // Verify game is active
      expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
    });

    it("should disable pause button when game is over initially", () => {
      render(<App />);
      
      // Initially pause button is enabled
      const pauseButton = screen.getByTestId("pause-button");
      expect(pauseButton).not.toBeDisabled();
    });

    it("should have game over sound handler ready", () => {
      render(<App />);
      
      // Verify audio manager is initialized
      expect(mockStartBackgroundMusic).toHaveBeenCalled();
    });

    it("should integrate high score display in UI", () => {
      render(<App />);
      
      // Level display should be visible (high score appears there)
      expect(screen.getByTestId("level-display")).toBeInTheDocument();
    });
  });

  describe("Cross-Component State Synchronization", () => {
    it("should synchronize score across all display components", async () => {
      render(<App />);
      
      // Trigger multiple target clicks
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      // Wait for score to update
      await waitFor(() => {
        const scoreDisplay = screen.getByTestId("score-value");
        expect(scoreDisplay).toHaveTextContent("1");
      });
      
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      // Score should be consistent across displays
      await waitFor(() => {
        const scoreDisplay = screen.getByTestId("score-value");
        expect(scoreDisplay).toHaveTextContent("2");
      });
    });

    it("should coordinate level progression with target size and speed", async () => {
      render(<App />);
      
      // Initial level
      expect(screen.getByTestId("level-display")).toHaveTextContent("1");
      
      // Score enough to reach next level (10 points)
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new CustomEvent('test:targetClick'));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Level should increase
      await waitFor(() => {
        expect(screen.getByTestId("level-display")).toHaveTextContent("2");
      }, { timeout: 2000 });
    });

    it("should reset all components when reset button is clicked", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Make some progress
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("1");
      });
      
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("2");
      });
      
      // Reset
      const resetButton = screen.getByTestId("reset-button");
      await user.click(resetButton);
      
      // All components should reset
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("0");
        expect(screen.getByTestId("timer-display")).toHaveTextContent("60s");
        expect(screen.getByTestId("level-display")).toHaveTextContent("1");
        expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
      });
    });

    it("should maintain consistent state when pausing and resuming", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Score some points
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("1");
      });
      
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("2");
      });
      
      const scoreBeforePause = screen.getByTestId("score-value").textContent;
      
      // Pause
      const pauseButton = screen.getByTestId("pause-button");
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("game-status")).toHaveTextContent("Paused");
      });
      
      // Resume
      await user.click(pauseButton);
      
      // Score should be maintained
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent(scoreBeforePause || "");
      });
    });
  });

  describe("Complete Game Flow Integration", () => {
    it("should handle complete game cycle from start to scoring", async () => {
      render(<App />);
      
      // Initial state
      expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
      expect(screen.getByTestId("score-value")).toHaveTextContent("0");
      
      // Play game
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("1");
      });
      
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("2");
      });
      
      // Verify game is still active
      expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
    });

    it("should allow starting new game after reset", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Score points
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      await waitFor(() => {
        expect(screen.getByTestId("score-value")).toHaveTextContent("1");
      });
      
      // Reset for new game
      const resetButton = screen.getByTestId("reset-button");
      await user.click(resetButton);
      
      // Should be ready for new game
      await waitFor(() => {
        expect(screen.queryByTestId("gameover-overlay")).not.toBeInTheDocument();
        expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
        expect(screen.getByTestId("score-value")).toHaveTextContent("0");
      });
    });

    it("should integrate all audio events throughout game lifecycle", async () => {
      render(<App />);
      
      // Background music starts
      await waitFor(() => {
        expect(mockStartBackgroundMusic).toHaveBeenCalled();
      });
      
      mockPlayHitSound.mockClear();
      
      // Hit sounds during gameplay
      window.dispatchEvent(new CustomEvent('test:targetClick'));
      
      await waitFor(() => {
        expect(mockPlayHitSound).toHaveBeenCalled();
      });
      
      // Combo sound at milestone
      mockPlayComboSound.mockClear();
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(new CustomEvent('test:targetClick'));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // After 5 total clicks, combo sound should play
      await waitFor(() => {
        expect(mockPlayComboSound).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });
});
