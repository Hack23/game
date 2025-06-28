import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { extendSpy } from "./test/setup";

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("App Component", () => {
  it("should render without crashing", () => {
    render(<App />);

    // Test basic elements that should always be present
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
    expect(screen.getByTestId("app-title")).toBeInTheDocument();
  });

  it("should extend Pixi components on mount", () => {
    render(<App />);

    // Verify extend was called
    expect(extendSpy).toHaveBeenCalled();
  });

  it("should display game title", () => {
    render(<App />);

    // Check for the app title text
    const appTitle = screen.getByTestId("app-title");
    expect(appTitle).toHaveTextContent("PixiJS React Game");
  });

  it("should display Pixi application", () => {
    render(<App />);
    // Verify Pixi Application is rendered
    const pixiApp = screen.getByTestId("pixi-application");
    expect(pixiApp).toBeInTheDocument();
  });

  it("should display instructions", () => {
    render(<App />);

    // Check instructions are displayed
    const instructions = screen.getByTestId("app-instructions");
    expect(instructions).toBeInTheDocument();
  });

  it("should display game elements", () => {
    render(<App />);

    // Check for game title
    const gameTitle = screen.getByTestId("game-title");
    expect(gameTitle).toHaveAttribute("data-text", "Circle Clicker");

    // Check for score display
    const scoreDisplay = screen.getByTestId("score-display");
    expect(scoreDisplay).toBeInTheDocument();

    // Check for game instructions
    const instructions = screen.getByTestId("instructions");
    expect(instructions).toBeInTheDocument();

    // Check for reset button
    const resetButton = screen.getByTestId("reset-button");
    expect(resetButton).toBeInTheDocument();
  });

  it("should handle pause/resume functionality", () => {
    render(<App />);

    // Get the pause button
    const pauseButton = screen.getByTestId("pause-button");
    expect(pauseButton).toBeInTheDocument();

    // Initially the game should be running (status shows Active)
    const gameStatus = screen.getByTestId("game-status");
    expect(gameStatus).toHaveAttribute("data-text", "🎯 Active");

    // Click pause button
    fireEvent.click(pauseButton);

    // After pause, the status should change to Paused
    expect(gameStatus).toHaveAttribute("data-text", "⏸️ Paused");

    // Pause overlay should appear
    const pauseOverlay = screen.getByTestId("pause-overlay");
    expect(pauseOverlay).toBeInTheDocument();

    // Click pause button again to resume
    fireEvent.click(pauseButton);

    // Status should be back to Active
    expect(gameStatus).toHaveAttribute("data-text", "🎯 Active");

    // Pause overlay should no longer be visible
    expect(screen.queryByTestId("pause-overlay")).not.toBeInTheDocument();
  });

  it("should reset the game when the reset button is clicked", () => {
    render(<App />);

    // Get the reset button
    const resetButton = screen.getByTestId("reset-button");

    // Click the reset button
    fireEvent.click(resetButton);

    // Score should be reset to 0
    const scoreValue = screen.getByTestId("score-value");
    expect(scoreValue).toHaveAttribute("data-text", "0");
  });
});
