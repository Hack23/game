import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock PixiJS components since they won't work in a test environment
vi.mock("@pixi/react", () => ({
  Application: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-pixi-app">{children}</div>
  ),
  useApplication: () => ({
    app: { screen: { width: 800, height: 600 }, renderer: true },
  }),
  extend: vi.fn(),
}));

vi.mock("@pixi/layout/components", () => ({
  LayoutContainer: ({ children, layout, "data-testid": testId }: any) => (
    <div
      data-testid={testId || "mocked-layout-container"}
      data-layout={JSON.stringify(layout)}
    >
      {children}
    </div>
  ),
}));

vi.mock("@pixi/layout/react", () => ({}));
vi.mock("@pixi/layout", () => ({}));

vi.mock("@pixi/ui", () => ({
  Button: ({ children, onPress }: any) => (
    <button onClick={onPress} data-testid="mocked-button">
      {children}
    </button>
  ),
  FancyButton: ({ text, onPress }: any) => (
    <button onClick={onPress} data-testid="mocked-fancy-button">
      {text}
    </button>
  ),
}));


describe("App", () => {
  beforeEach(() => {
    // Reset window dimensions for consistent testing
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });

    // Mock window.scrollTo to prevent errors
    window.scrollTo = vi.fn();
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
    expect(screen.getByTestId("app-title")).toBeInTheDocument();
    expect(screen.getByTestId("mocked-pixi-app")).toBeInTheDocument();
  });

  it("renders app title and instructions", () => {
    render(<App />);
    expect(screen.getByTestId("app-title")).toHaveTextContent(
      "PixiJS React Game"
    );
    expect(screen.getByTestId("app-instructions")).toBeInTheDocument();
  });

  it("responds to window resize events", async () => {
    render(<App />);

    // Trigger resize event
    Object.defineProperty(window, "innerWidth", { value: 500 });
    Object.defineProperty(window, "innerHeight", { value: 500 });
    fireEvent(window, new Event("resize"));

    // Check that scrollTo was called (part of resize handler)
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  // Test game functionality through mocked components
  it("handles game interactions through mocked components", () => {
    render(<App />);

    // Find mocked game buttons
    const resetButtons = screen.getAllByTestId("mocked-fancy-button");
    const resetButton = resetButtons.find((button) =>
      button.textContent?.includes("Reset")
    );

    // Verify reset button exists
    expect(resetButton).toBeInTheDocument();

    // We can't test the actual game mechanics since we've mocked the PixiJS components,
    // but we can verify the basic structure is there
  });
});
