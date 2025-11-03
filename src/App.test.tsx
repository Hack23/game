import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { describe, it, expect, beforeAll, vi } from "vitest";
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
    camera: {},
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
}));

describe("App Component", () => {
  it("renders the app container", () => {
    render(<App />);
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
  });

  it("renders the app title with Three.js", () => {
    render(<App />);
    expect(screen.getByTestId("app-title")).toHaveTextContent("Target Shooter");
  });

  it("renders the Three.js canvas container", () => {
    render(<App />);
    expect(screen.getByTestId("threejs-canvas-container")).toBeInTheDocument();
  });

  it("renders app instructions", () => {
    render(<App />);
    expect(screen.getByTestId("app-instructions")).toHaveTextContent(
      "An immersive 3D target shooting game with combos, levels, and time pressure!"
    );
  });

  it("renders the score display", () => {
    render(<App />);
    expect(screen.getByTestId("score-display")).toBeInTheDocument();
    expect(screen.getByTestId("score-label")).toHaveTextContent("SCORE");
    expect(screen.getByTestId("score-value")).toBeInTheDocument();
  });

  it("renders game controls", () => {
    render(<App />);
    expect(screen.getByTestId("pause-button")).toBeInTheDocument();
    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
  });

  it("renders the target sphere", () => {
    render(<App />);
    const canvas = screen.getByTestId("mocked-threejs-canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("renders orbit controls", () => {
    render(<App />);
    expect(screen.getByTestId("mocked-orbit-controls")).toBeInTheDocument();
  });

  it("canvas has correct inline styles", () => {
    render(<App />);
    const canvasContainer = screen.getByTestId("threejs-canvas-container");
    expect(canvasContainer).toHaveStyle({ width: "100%", height: "600px" });
  });

  it("renders all Three.js scene elements", () => {
    render(<App />);
    // Verify that the mocked canvas renders children
    const canvas = screen.getByTestId("mocked-threejs-canvas");
    expect(canvas.children.length).toBeGreaterThan(0);
  });
});
