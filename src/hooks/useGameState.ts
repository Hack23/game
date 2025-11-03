import { useState, useCallback, useEffect, useRef } from "react";

// Game spatial boundaries for player position randomization
const PLAYER_X_RANGE = 4; // Range: -2 to +2
const PLAYER_Y_RANGE = 3; // Range: -1.5 to +1.5
const PLAYER_Z_RANGE = 2; // Range: -1 to +1

// Game configuration constants
const GAME_DURATION = 60; // 60 seconds
const COMBO_TIMEOUT = 2000; // 2 seconds to maintain combo
const BASE_TARGET_SIZE = 0.5;
const MIN_TARGET_SIZE = 0.3;

export interface GameState {
  score: number;
  playerX: number;
  playerY: number;
  playerZ: number;
  isPlaying: boolean;
  timeLeft: number;
  combo: number;
  highScore: number;
  targetSize: number;
  level: number;
  isNewHighScore: boolean;
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
    timeLeft: initialState?.timeLeft ?? GAME_DURATION,
    combo: initialState?.combo ?? 0,
    highScore: initialState?.highScore ?? 0,
    targetSize: initialState?.targetSize ?? BASE_TARGET_SIZE,
    level: initialState?.level ?? 1,
    isNewHighScore: initialState?.isNewHighScore ?? false,
  });

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return (): void => {
      if (comboTimerRef.current !== null) {
        clearTimeout(comboTimerRef.current);
      }
      if (gameTimerRef.current !== null) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, []);

  // Game timer effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      gameTimerRef.current = setInterval(() => {
        setGameState((prev) => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            const isNewHigh = prev.score > prev.highScore;
            return {
              ...prev,
              timeLeft: 0,
              isPlaying: false,
              highScore: Math.max(prev.highScore, prev.score),
              isNewHighScore: isNewHigh,
            };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    } else if (gameTimerRef.current !== null) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }

    return (): void => {
      if (gameTimerRef.current !== null) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameState.isPlaying]);

  const incrementScore = useCallback(() => {
    setGameState((prev) => {
      const newCombo = prev.combo + 1;
      const comboBonus = Math.floor(newCombo / 5); // Bonus point every 5 combo
      const newScore = prev.score + 1 + comboBonus;
      
      // Increase difficulty: smaller target and higher level
      const newLevel = Math.floor(newScore / 10) + 1;
      const newTargetSize = Math.max(
        MIN_TARGET_SIZE,
        BASE_TARGET_SIZE - (newLevel - 1) * 0.05
      );

      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        level: newLevel,
        targetSize: newTargetSize,
        playerX: Math.random() * PLAYER_X_RANGE - PLAYER_X_RANGE / 2,
        playerY: Math.random() * PLAYER_Y_RANGE - PLAYER_Y_RANGE / 2,
        playerZ: Math.random() * PLAYER_Z_RANGE - PLAYER_Z_RANGE / 2,
      };
    });

    // Reset combo timer
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
    }
    comboTimerRef.current = setTimeout(() => {
      setGameState((prev) => ({ ...prev, combo: 0 }));
    }, COMBO_TIMEOUT);
  }, []);

  const resetGame = useCallback((): void => {
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
    }
    if (gameTimerRef.current !== null) {
      clearInterval(gameTimerRef.current);
    }
    
    setGameState((prev) => ({
      score: 0,
      playerX: 0,
      playerY: 0,
      playerZ: 0,
      isPlaying: true,
      timeLeft: GAME_DURATION,
      combo: 0,
      highScore: prev.highScore,
      targetSize: BASE_TARGET_SIZE,
      level: 1,
      isNewHighScore: false,
    }));
  }, []);

  const togglePause = useCallback((): void => {
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
