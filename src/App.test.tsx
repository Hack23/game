import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { it, expect, beforeAll, vi } from "vitest";
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
}));

// Mock @react-three/drei components
vi.mock("@react-three/drei", (): object => ({
  OrbitControls: (): ReactElement => <div data-testid="mocked-orbit-controls" />,
  Html: ({ children }: { children: ReactNode }): ReactElement => (
    <div data-testid="mocked-html">{children}</div>
  ),
}));

it("renders the app container", () => {
  render(<App />);
  expect(screen.getByTestId("app-container")).toBeInTheDocument();
});

it("renders the app title with Three.js", () => {
  render(<App />);
  expect(screen.getByTestId("app-title")).toHaveTextContent("Three.js React Game");
});

it("renders the Three.js canvas container", () => {
  render(<App />);
  expect(screen.getByTestId("threejs-canvas-container")).toBeInTheDocument();
});
