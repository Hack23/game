import { useState, useCallback } from "react";

// Game spatial boundaries for player position randomization
const PLAYER_X_RANGE = 4; // Range: -2 to +2
const PLAYER_Y_RANGE = 3; // Range: -1.5 to +1.5
const PLAYER_Z_RANGE = 2; // Range: -1 to +1

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
      playerX: Math.random() * PLAYER_X_RANGE - PLAYER_X_RANGE / 2,
      playerY: Math.random() * PLAYER_Y_RANGE - PLAYER_Y_RANGE / 2,
      playerZ: Math.random() * PLAYER_Z_RANGE - PLAYER_Z_RANGE / 2,
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
