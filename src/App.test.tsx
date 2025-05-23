import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the Vite and React logos", () => {
    render(<App />);
    const viteLogo = screen.getByAltText("Vite logo");
    expect(viteLogo).toBeInTheDocument();

    const reactLogo = screen.getByAltText("React logo");
    expect(reactLogo).toBeInTheDocument();
  });

  it("displays the header text", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /Vite \+ React/i });
    expect(heading).toBeInTheDocument();
  });

  it("updates count when button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initial state check
    const button = screen.getByRole("button", { name: /count is 0/i });
    expect(button).toBeInTheDocument();

    // Click the button using userEvent
    await user.click(button);

    // Wait for the state update to be reflected in the DOM
    await waitFor(() => {
      expect(screen.getByText(/count is 1/i)).toBeInTheDocument();
    });
  });
});
