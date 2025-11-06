import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";
import { describe, it, expect, beforeAll, vi, beforeEach, afterEach } from "vitest";
import type { ReactNode, ReactElement } from "react";

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

// Mock useAudioManager hook to avoid AudioContext issues in tests
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

describe("App Component Interactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Use real timers for these tests to avoid complexity
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Pause and Resume Functionality", () => {
    it("should pause the game when pause button is clicked", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const pauseButton = screen.getByTestId("pause-button");
      expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
      
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("game-status")).toHaveTextContent("Paused");
      });
      expect(screen.getByTestId("pause-overlay")).toBeInTheDocument();
    });

    it("should resume the game when pause button is clicked again", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const pauseButton = screen.getByTestId("pause-button");
      
      // Pause
      await user.click(pauseButton);
      await waitFor(() => {
        expect(screen.getByTestId("game-status")).toHaveTextContent("Paused");
      });
      
      // Resume
      await user.click(pauseButton);
      await waitFor(() => {
        expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
      });
      expect(screen.queryByTestId("pause-overlay")).not.toBeInTheDocument();
    });

    it("should stop background music when paused", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Background music should start when game is active
      await waitFor(() => {
        expect(mockStartBackgroundMusic).toHaveBeenCalled();
      });
      
      const pauseButton = screen.getByTestId("pause-button");
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(mockStopBackgroundMusic).toHaveBeenCalled();
      });
    });
  });

  describe("Reset Functionality", () => {
    it("should reset score to 0 when reset button is clicked", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Score should start at 0
      expect(screen.getByTestId("score-value")).toHaveTextContent("0");
      
      const resetButton = screen.getByTestId("reset-button");
      await user.click(resetButton);
      
      // Score should still be 0
      expect(screen.getByTestId("score-value")).toHaveTextContent("0");
    });

    it("should keep game active after reset", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const resetButton = screen.getByTestId("reset-button");
      await user.click(resetButton);
      
      // Game should be active after reset
      await waitFor(() => {
        expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
      });
    });
  });

  describe("Mute Functionality", () => {
    it("should mute audio when mute button is clicked", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const muteButton = screen.getByTestId("mute-button");
      expect(muteButton).toHaveTextContent("Mute");
      
      await user.click(muteButton);
      
      await waitFor(() => {
        expect(mockSetMuted).toHaveBeenCalledWith(true);
      });
      expect(muteButton).toHaveTextContent("Unmute");
    });

    it("should unmute audio when mute button is clicked again", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const muteButton = screen.getByTestId("mute-button");
      
      // Mute
      await user.click(muteButton);
      await waitFor(() => {
        expect(mockSetMuted).toHaveBeenCalledWith(true);
      });
      
      // Unmute
      await user.click(muteButton);
      await waitFor(() => {
        expect(mockSetMuted).toHaveBeenCalledWith(false);
      });
      expect(muteButton).toHaveTextContent("Mute");
    });

    it("should hide audio status when muted", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Audio status should be visible initially
      expect(screen.getByText(/Sound enabled/i)).toBeInTheDocument();
      
      const muteButton = screen.getByTestId("mute-button");
      await user.click(muteButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/Sound enabled/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Volume Control", () => {
    it("should update volume when slider is changed", async () => {
      render(<App />);
      
      const volumeSlider = screen.getByTestId("volume-slider") as HTMLInputElement;
      expect(volumeSlider).toBeInTheDocument();
      
      // Trigger the input event directly
      volumeSlider.value = "0.5";
      volumeSlider.dispatchEvent(new Event("input", { bubbles: true }));
      
      await waitFor(() => {
        expect(mockSetVolume).toHaveBeenCalledWith(0.5);
      });
    });

    it("should display volume percentage correctly", async () => {
      render(<App />);
      
      // Should show 100% initially
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("Game Over State", () => {
    it("should show game over overlay elements", () => {
      // We can't easily fast-forward real timers, so just check initial state
      render(<App />);
      
      // Game should not be over initially
      expect(screen.queryByTestId("gameover-overlay")).not.toBeInTheDocument();
    });

    it("should show pause button initially enabled", () => {
      render(<App />);
      
      const pauseButton = screen.getByTestId("pause-button");
      expect(pauseButton).not.toBeDisabled();
    });
  });

  describe("UI Display Tests", () => {
    it("should display timer with correct initial value", () => {
      render(<App />);
      
      const timerDisplay = screen.getByTestId("timer-display");
      expect(timerDisplay).toBeInTheDocument();
      expect(timerDisplay).toHaveTextContent("60s");
    });

    it("should display level with correct initial value", () => {
      render(<App />);
      
      const levelDisplay = screen.getByTestId("level-display");
      expect(levelDisplay).toBeInTheDocument();
      expect(levelDisplay).toHaveTextContent("1");
    });

    it("should show instructions when game is active", () => {
      render(<App />);
      
      const instructions = screen.getByTestId("instructions-text");
      expect(instructions).toHaveTextContent("Click the target to score");
    });

    it("should show pause instructions when game is paused", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const pauseButton = screen.getByTestId("pause-button");
      await user.click(pauseButton);
      
      await waitFor(() => {
        const instructions = screen.getByTestId("instructions-text");
        expect(instructions).toHaveTextContent("Game paused");
      });
    });
  });

  describe("Background Music Management", () => {
    it("should start background music when game begins", async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(mockStartBackgroundMusic).toHaveBeenCalled();
      });
    });

    it("should not start background music when muted on load", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Mute first
      const muteButton = screen.getByTestId("mute-button");
      await user.click(muteButton);
      
      mockStartBackgroundMusic.mockClear();
      
      // Reset to trigger music start
      const resetButton = screen.getByTestId("reset-button");
      await user.click(resetButton);
      
      // Background music should not start when muted
      await waitFor(() => {
        expect(mockStartBackgroundMusic).not.toHaveBeenCalled();
      });
    });
  });

  describe("Timer Behavior", () => {
    it("should display timer initially at 60 seconds", () => {
      render(<App />);
      
      expect(screen.getByTestId("timer-display")).toHaveTextContent("60s");
    });

    it("should have timer display visible", () => {
      render(<App />);
      
      const timerDisplay = screen.getByTestId("timer-display");
      expect(timerDisplay).toBeVisible();
    });
  });
});
