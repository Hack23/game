import { useState, useCallback, useEffect, useRef } from "react";
import { createTarget, updateTargetPhysics } from "../utils/targetPhysics";
import {
  GAME_DURATION,
  COMBO_TIMEOUT,
  getTargetCountForLevel,
  getTargetSizeForLevel,
  calculateLevel,
  getSpeedMultiplierForLevel,
  BASE_TARGET_SIZE,
} from "../utils/gameConfig";

/**
 * Create initial targets array based on level
 */
function createInitialTargets(level: number, targetSize: number): Target[] {
  const count = getTargetCountForLevel(level);
  return Array.from({ length: count }, (_, i) => createTarget(i, targetSize));
}

export interface Target {
  id: number;
  x: number;
  y: number;
  z: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  size: number;
}

export interface GameState {
  score: number;
  isPlaying: boolean;
  timeLeft: number;
  combo: number;
  highScore: number;
  targetSize: number;
  level: number;
  isNewHighScore: boolean;
  targets: Target[]; // Multiple targets support
  totalClicks: number; // Track total clicks for accuracy
  successfulHits: number; // Track successful hits
}

export interface UseGameStateReturn {
  gameState: GameState;
  incrementScore: (targetId: number) => void;
  recordMiss: () => void;
  resetGame: () => void;
  togglePause: () => void;
}

/**
 * Custom hook to manage game state
 * @param initialState - Optional partial initial state for the game
 * @returns Game state and control functions
 */
export function useGameState(initialState?: Partial<GameState>): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>(() => {
    const level = initialState?.level ?? 1;
    const targetSize = initialState?.targetSize ?? BASE_TARGET_SIZE;
    return {
      score: initialState?.score ?? 0,
      isPlaying: initialState?.isPlaying ?? true,
      timeLeft: initialState?.timeLeft ?? GAME_DURATION,
      combo: initialState?.combo ?? 0,
      highScore: initialState?.highScore ?? 0,
      targetSize,
      level,
      isNewHighScore: initialState?.isNewHighScore ?? false,
      targets: initialState?.targets ?? createInitialTargets(level, targetSize),
      totalClicks: initialState?.totalClicks ?? 0,
      successfulHits: initialState?.successfulHits ?? 0,
    };
  });

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return (): void => {
      if (comboTimerRef.current !== null) {
        clearTimeout(comboTimerRef.current);
      }
      if (gameTimerRef.current !== null) {
        clearInterval(gameTimerRef.current);
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Ball bouncing animation effect
  useEffect(() => {
    if (!gameState.isPlaying || gameState.timeLeft <= 0) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (): void => {
      setGameState((prev) => {
        // Calculate speed multiplier based on level
        const speedMultiplier = getSpeedMultiplierForLevel(prev.level);

        // Update all targets using physics utility
        const updatedTargets = prev.targets.map((target) =>
          updateTargetPhysics(target, speedMultiplier)
        );

        return {
          ...prev,
          targets: updatedTargets,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return (): void => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.timeLeft]);

  // Game timer effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      if (gameTimerRef.current !== null) {
        clearInterval(gameTimerRef.current);
      }
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
  }, [gameState.isPlaying, gameState.timeLeft]);

  const incrementScore = useCallback((targetId: number) => {
    setGameState((prev) => {
      const newCombo = prev.combo + 1;
      // Only give bonus when reaching exactly a multiple of 5
      const comboBonus = newCombo % 5 === 0 ? 1 : 0;
      const newScore = prev.score + 1 + comboBonus;
      
      // Calculate new level and target size using utilities
      const newLevel = calculateLevel(newScore);
      const newTargetSize = getTargetSizeForLevel(newLevel);

      // Replace the hit target with a new one
      const newTargets = prev.targets.map((target) => {
        if (target.id === targetId) {
          return createTarget(target.id, newTargetSize);
        }
        return { ...target, size: newTargetSize };
      });

      // Adjust target count based on new level
      const targetCount = getTargetCountForLevel(newLevel);
      let updatedTargets = newTargets;
      if (targetCount > newTargets.length) {
        // Add new targets
        const newTargetId = Math.max(...newTargets.map(t => t.id)) + 1;
        updatedTargets = [...newTargets, createTarget(newTargetId, newTargetSize)];
      } else if (targetCount < newTargets.length) {
        // Remove excess targets
        updatedTargets = newTargets.slice(0, targetCount);
      }

      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        level: newLevel,
        targetSize: newTargetSize,
        targets: updatedTargets,
        successfulHits: prev.successfulHits + 1,
        totalClicks: prev.totalClicks + 1,
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

  const recordMiss = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      combo: 0, // Break combo on miss
    }));
    
    // Clear combo timer since combo is broken
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
    }
  }, []);

  const resetGame = useCallback((): void => {
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
    }
    if (gameTimerRef.current !== null) {
      clearInterval(gameTimerRef.current);
    }
    
    const initialTargets = createInitialTargets(1, BASE_TARGET_SIZE);
    setGameState((prev) => ({
      score: 0,
      isPlaying: true,
      timeLeft: GAME_DURATION,
      combo: 0,
      highScore: prev.highScore,
      targetSize: BASE_TARGET_SIZE,
      level: 1,
      isNewHighScore: false,
      targets: initialTargets,
      totalClicks: 0,
      successfulHits: 0,
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
    recordMiss,
    resetGame,
    togglePause,
  };
}
