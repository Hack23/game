import { useState, useCallback } from "react";

export interface GameState {
  score: number;
  playerX: number;
  playerY: number;
  playerZ: number;
  isPlaying: boolean;
}

export interface UseGameStateReturn {
  gameState: GameState;
  incrementScore: () => void;
  resetGame: () => void;
  togglePause: () => void;
}

/**
 * Custom hook to manage game state
 * @param initialState - Optional partial initial state for the game
 * @returns Game state and control functions
 */
export function useGameState(initialState?: Partial<GameState>): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>({
    score: initialState?.score ?? 0,
    playerX: initialState?.playerX ?? 0,
    playerY: initialState?.playerY ?? 0,
    playerZ: initialState?.playerZ ?? 0,
    isPlaying: initialState?.isPlaying ?? true,
  });

  const incrementScore = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      playerX: Math.random() * 4 - 2,
      playerY: Math.random() * 3 - 1.5,
      playerZ: Math.random() * 2 - 1,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      playerX: 0,
      playerY: 0,
      playerZ: 0,
      isPlaying: true,
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  return {
    gameState,
    incrementScore,
    resetGame,
    togglePause,
  };
}
