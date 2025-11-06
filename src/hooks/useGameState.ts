import { useState, useCallback, useEffect, useRef } from "react";

// Game spatial boundaries for player position randomization
const PLAYER_X_RANGE = 4; // Range: -2 to +2
const PLAYER_Y_RANGE = 3; // Range: -1.5 to +1.5
const PLAYER_Z_RANGE = 2; // Range: -1 to +1

// Game configuration constants
const GAME_DURATION = 60; // 60 seconds
const COMBO_TIMEOUT = 2000; // 2 seconds to maintain combo
const BASE_TARGET_SIZE = 0.5;
const MIN_TARGET_SIZE = 0.25; // Made smaller for increased difficulty
const BASE_SPEED = 0.02; // Base speed for ball movement

/**
 * Generate a random velocity for ball movement
 * @returns Random velocity value
 */
function generateRandomVelocity(): number {
  return (Math.random() - 0.5) * BASE_SPEED * 2;
}

export interface GameState {
  score: number;
  playerX: number;
  playerY: number;
  playerZ: number;
  velocityX: number; // Ball velocity in X direction
  velocityY: number; // Ball velocity in Y direction
  velocityZ: number; // Ball velocity in Z direction
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
  const [gameState, setGameState] = useState<GameState>(() => ({
    score: initialState?.score ?? 0,
    playerX: initialState?.playerX ?? 0,
    playerY: initialState?.playerY ?? 0,
    playerZ: initialState?.playerZ ?? 0,
    velocityX: initialState?.velocityX ?? generateRandomVelocity(),
    velocityY: initialState?.velocityY ?? generateRandomVelocity(),
    velocityZ: initialState?.velocityZ ?? generateRandomVelocity(),
    isPlaying: initialState?.isPlaying ?? true,
    timeLeft: initialState?.timeLeft ?? GAME_DURATION,
    combo: initialState?.combo ?? 0,
    highScore: initialState?.highScore ?? 0,
    targetSize: initialState?.targetSize ?? BASE_TARGET_SIZE,
    level: initialState?.level ?? 1,
    isNewHighScore: initialState?.isNewHighScore ?? false,
  }));

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
        // Calculate speed multiplier based on level (increases with level)
        const speedMultiplier = 1 + (prev.level - 1) * 0.15;

        // Update positions
        let newX = prev.playerX + prev.velocityX * speedMultiplier;
        let newY = prev.playerY + prev.velocityY * speedMultiplier;
        let newZ = prev.playerZ + prev.velocityZ * speedMultiplier;

        // Update velocities for bouncing
        let newVelocityX = prev.velocityX;
        let newVelocityY = prev.velocityY;
        let newVelocityZ = prev.velocityZ;

        // Bounce off boundaries with slight randomization
        const halfRange = PLAYER_X_RANGE / 2;
        if (newX > halfRange || newX < -halfRange) {
          newVelocityX = -prev.velocityX * (0.95 + Math.random() * 0.1);
          newX = Math.max(-halfRange, Math.min(halfRange, newX));
        }

        const halfYRange = PLAYER_Y_RANGE / 2;
        if (newY > halfYRange || newY < -halfYRange) {
          newVelocityY = -prev.velocityY * (0.95 + Math.random() * 0.1);
          newY = Math.max(-halfYRange, Math.min(halfYRange, newY));
        }

        const halfZRange = PLAYER_Z_RANGE / 2;
        if (newZ > halfZRange || newZ < -halfZRange) {
          newVelocityZ = -prev.velocityZ * (0.95 + Math.random() * 0.1);
          newZ = Math.max(-halfZRange, Math.min(halfZRange, newZ));
        }

        return {
          ...prev,
          playerX: newX,
          playerY: newY,
          playerZ: newZ,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          velocityZ: newVelocityZ,
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

  const incrementScore = useCallback(() => {
    setGameState((prev) => {
      const newCombo = prev.combo + 1;
      // Only give bonus when reaching exactly a multiple of 5
      const comboBonus = newCombo % 5 === 0 ? 1 : 0;
      const newScore = prev.score + 1 + comboBonus;
      
      // Increase difficulty: smaller target and higher level
      const newLevel = Math.floor(newScore / 10) + 1;
      const newTargetSize = Math.max(
        MIN_TARGET_SIZE,
        BASE_TARGET_SIZE - (newLevel - 1) * 0.04
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
        velocityX: generateRandomVelocity(),
        velocityY: generateRandomVelocity(),
        velocityZ: generateRandomVelocity(),
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
      velocityX: generateRandomVelocity(),
      velocityY: generateRandomVelocity(),
      velocityZ: generateRandomVelocity(),
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
