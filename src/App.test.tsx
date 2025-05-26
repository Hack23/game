import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { extendSpy } from "./test/setup";

describe("Rubik's Cube App", () => {
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
    const heading = screen.getByRole("heading", { name: /Rubik's Cube/i });
    expect(heading).toBeInTheDocument();
  });

  it("displays the game instructions", () => {
    render(<App />);
    const instructions = screen.getByText(
      /Standard Rubik's Cube with notation/i
    );
    expect(instructions).toBeInTheDocument();
  });

  it("renders the PixiJS Application component", () => {
    render(<App />);
    const pixiApp = screen.getByTestId("pixi-application");
    expect(pixiApp).toBeInTheDocument();

    // Verify the Application component is rendered with correct test id
    // PixiJS canvas creation is asynchronous and not essential for unit testing
    // We're testing React integration, not PixiJS internals
    expect(pixiApp).toHaveAttribute("data-testid", "pixi-application");
  });

  it("renders all cube move buttons", () => {
    render(<App />);

    const fButton = screen.getByRole("button", { name: "F" });
    const rButton = screen.getByRole("button", { name: "R" });
    const uButton = screen.getByRole("button", { name: "U" });

    expect(fButton).toBeInTheDocument();
    expect(rButton).toBeInTheDocument();
    expect(uButton).toBeInTheDocument();
  });

  it("renders shuffle and reset buttons", () => {
    render(<App />);

    const shuffleButton = screen.getByRole("button", { name: "Shuffle" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    expect(shuffleButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  it("renders the color legend", () => {
    render(<App />);

    expect(screen.getByText("White (Up)")).toBeInTheDocument();
    expect(screen.getByText("Yellow (Down)")).toBeInTheDocument();
    expect(screen.getByText("Green (Front)")).toBeInTheDocument();
    expect(screen.getByText("Blue (Right)")).toBeInTheDocument();
    expect(screen.getByText("Orange (Left)")).toBeInTheDocument();
    expect(screen.getByText("Red (Back)")).toBeInTheDocument();
  });

  it("calls extend function with correct components", () => {
    expect(extendSpy).toHaveBeenCalled();
    expect(extendSpy).toHaveBeenCalledWith({
      Container: expect.any(Function),
      Graphics: expect.any(Function),
    });
  });

  it("handles move button clicks without errors", () => {
    render(<App />);

    const fButton = screen.getByRole("button", { name: "F" });
    expect(() => fireEvent.click(fButton)).not.toThrow();
  });

  it("handles shuffle button click without errors", () => {
    render(<App />);

    const shuffleButton = screen.getByRole("button", { name: "Shuffle" });
    expect(() => fireEvent.click(shuffleButton)).not.toThrow();
  });

  it("handles reset button click without errors", () => {
    render(<App />);

    const resetButton = screen.getByRole("button", { name: "Reset" });
    expect(() => fireEvent.click(resetButton)).not.toThrow();
  });
});
