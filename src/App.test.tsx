import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { extendSpy } from "./test/setup";

describe("PixiJS Game App", () => {
  let App: React.ComponentType;

  beforeEach(async () => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Clear the extend spy call history
    extendSpy.mockClear();

    // Reset module cache to ensure fresh import
    vi.resetModules();

    // Import App which should trigger the extend call
    const appModule = await import("./App");
    App = appModule.default;
  });

  it("renders the game title", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /PixiJS React Game/i });
    expect(heading).toBeInTheDocument();
  });

  it("displays the game instructions", () => {
    render(<App />);
    const instructions = screen.getByText(
      /A minimal PixiJS game built with @pixi\/react/i
    );
    expect(instructions).toBeInTheDocument();
  });

  it("renders the PixiJS Application component", () => {
    render(<App />);
    const pixiApp = screen.getByTestId("pixi-application");
    expect(pixiApp).toBeInTheDocument();
    expect(pixiApp).toHaveAttribute("data-width", "800");
    expect(pixiApp).toHaveAttribute("data-height", "600");
  });

  it("has the correct page structure", () => {
    render(<App />);

    // Check for main container
    const container = document.querySelector(".app-container");
    expect(container).toBeInTheDocument();

    // Check for heading
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("PixiJS React Game");

    // Check for instructions paragraph
    const instructions = screen.getByText(/minimal PixiJS game/i);
    expect(instructions).toBeInTheDocument();
  });

  it("calls extend function on module load", () => {
    // The extend function should have been called when App.tsx was imported
    // in the beforeEach hook
    expect(extendSpy).toHaveBeenCalled();
    expect(extendSpy).toHaveBeenCalledWith({
      Container: expect.any(Function),
      Graphics: expect.any(Function),
      Text: expect.any(Function),
    });
  });
});
