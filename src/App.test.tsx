import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { it, expect, beforeAll, vi } from "vitest";

// Add this to the top of the file to mock window.scrollTo for jsdom
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.scrollTo = () => {};
});

// Mock the entire @pixi/react module to avoid renderer issues in jsdom
vi.mock("@pixi/react", () => ({
  Application: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-pixi-application">{children}</div>
  ),
  extend: vi.fn(),
  useApplication: () => ({ app: null }),
}));

// Mock PixiJS core classes
vi.mock("pixi.js", () => ({
  Container: class MockContainer {},
  Graphics: class MockGraphics {},
  Text: class MockText {},
}));

// Mock @pixi/layout and @pixi/ui
vi.mock("@pixi/layout/components", () => ({
  LayoutContainer: class MockLayoutContainer {},
}));

vi.mock("@pixi/ui", () => ({
  Button: class MockButton {},
  FancyButton: class MockFancyButton {},
}));

it("renders the app container", () => {
  render(<App />);
  expect(screen.getByTestId("app-container")).toBeInTheDocument();
});
