import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useGameState } from "./hooks/useGameState";

describe("useGameState Hook", () => {
  it("initializes with default values", () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.playerX).toBe(0);
    expect(result.current.gameState.playerY).toBe(0);
    expect(result.current.gameState.playerZ).toBe(0);
    expect(result.current.gameState.isPlaying).toBe(true);
  });

  it("initializes with custom values", () => {
    const { result } = renderHook(() =>
      useGameState({ score: 10, playerX: 5, isPlaying: false })
    );
    
    expect(result.current.gameState.score).toBe(10);
    expect(result.current.gameState.playerX).toBe(5);
    expect(result.current.gameState.isPlaying).toBe(false);
  });

  it("increments score and randomizes position", () => {
    const { result } = renderHook(() => useGameState());
    
    const initialScore = result.current.gameState.score;
    const initialX = result.current.gameState.playerX;
    
    act(() => {
      result.current.incrementScore();
    });
    
    expect(result.current.gameState.score).toBe(initialScore + 1);
    // Position should be randomized (different from initial)
    expect(
      result.current.gameState.playerX !== initialX ||
      result.current.gameState.playerY !== 0 ||
      result.current.gameState.playerZ !== 0
    ).toBe(true);
  });

  it("increments score multiple times", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore();
      result.current.incrementScore();
      result.current.incrementScore();
    });
    
    expect(result.current.gameState.score).toBe(3);
  });

  it("resets game to initial state", () => {
    const { result } = renderHook(() => useGameState({ score: 10 }));
    
    act(() => {
      result.current.incrementScore();
      result.current.incrementScore();
    });
    
    expect(result.current.gameState.score).toBeGreaterThan(0);
    
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.playerX).toBe(0);
    expect(result.current.gameState.playerY).toBe(0);
    expect(result.current.gameState.playerZ).toBe(0);
    expect(result.current.gameState.isPlaying).toBe(true);
  });

  it("toggles pause state", () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.isPlaying).toBe(true);
    
    act(() => {
      result.current.togglePause();
    });
    
    expect(result.current.gameState.isPlaying).toBe(false);
    
    act(() => {
      result.current.togglePause();
    });
    
    expect(result.current.gameState.isPlaying).toBe(true);
  });

  it("maintains score when toggling pause", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore();
      result.current.incrementScore();
    });
    
    const scoreBeforePause = result.current.gameState.score;
    
    act(() => {
      result.current.togglePause();
    });
    
    expect(result.current.gameState.score).toBe(scoreBeforePause);
    expect(result.current.gameState.isPlaying).toBe(false);
  });

  it("randomizes player position within expected range on score increment", () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.incrementScore();
    });
    
    // Check that positions are within expected ranges
    expect(result.current.gameState.playerX).toBeGreaterThanOrEqual(-2);
    expect(result.current.gameState.playerX).toBeLessThanOrEqual(2);
    expect(result.current.gameState.playerY).toBeGreaterThanOrEqual(-1.5);
    expect(result.current.gameState.playerY).toBeLessThanOrEqual(1.5);
    expect(result.current.gameState.playerZ).toBeGreaterThanOrEqual(-1);
    expect(result.current.gameState.playerZ).toBeLessThanOrEqual(1);
  });
});
