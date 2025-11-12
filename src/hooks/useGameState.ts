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

/**
 * Calculate number of targets based on level
 * Level 1-3: 1 target
 * Level 4-6: 2 targets  
 * Level 7+: 3 targets
 */
function getTargetCountForLevel(level: number): number {
  if (level <= 3) return 1;
  if (level <= 6) return 2;
  return 3;
}

/**
 * Create a new target with random position and velocity
 */
function createTarget(id: number, size: number): Target {
  return {
    id,
    x: Math.random() * PLAYER_X_RANGE - PLAYER_X_RANGE / 2,
    y: Math.random() * PLAYER_Y_RANGE - PLAYER_Y_RANGE / 2,
    z: Math.random() * PLAYER_Z_RANGE - PLAYER_Z_RANGE / 2,
    velocityX: generateRandomVelocity(),
    velocityY: generateRandomVelocity(),
    velocityZ: generateRandomVelocity(),
    size,
  };
}

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
        // Calculate speed multiplier based on level (increases with level)
        const speedMultiplier = 1 + (prev.level - 1) * 0.15;

        // Update all targets
        const updatedTargets = prev.targets.map((target) => {
          // Update positions
          let newX = target.x + target.velocityX * speedMultiplier;
          let newY = target.y + target.velocityY * speedMultiplier;
          let newZ = target.z + target.velocityZ * speedMultiplier;

          // Update velocities for bouncing
          let newVelocityX = target.velocityX;
          let newVelocityY = target.velocityY;
          let newVelocityZ = target.velocityZ;

          // Bounce off boundaries with slight randomization
          const halfRange = PLAYER_X_RANGE / 2;
          if (newX > halfRange || newX < -halfRange) {
            newVelocityX = -target.velocityX * (0.95 + Math.random() * 0.1);
            newX = Math.max(-halfRange, Math.min(halfRange, newX));
          }

          const halfYRange = PLAYER_Y_RANGE / 2;
          if (newY > halfYRange || newY < -halfYRange) {
            newVelocityY = -target.velocityY * (0.95 + Math.random() * 0.1);
            newY = Math.max(-halfYRange, Math.min(halfYRange, newY));
          }

          const halfZRange = PLAYER_Z_RANGE / 2;
          if (newZ > halfZRange || newZ < -halfZRange) {
            newVelocityZ = -target.velocityZ * (0.95 + Math.random() * 0.1);
            newZ = Math.max(-halfZRange, Math.min(halfZRange, newZ));
          }

          return {
            ...target,
            x: newX,
            y: newY,
            z: newZ,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
            velocityZ: newVelocityZ,
          };
        });

        // Keep backward compatibility for old single target state
        const firstTarget = updatedTargets[0];
        return {
          ...prev,
          targets: updatedTargets,
          playerX: firstTarget?.x ?? prev.playerX,
          playerY: firstTarget?.y ?? prev.playerY,
          playerZ: firstTarget?.z ?? prev.playerZ,
          velocityX: firstTarget?.velocityX ?? prev.velocityX,
          velocityY: firstTarget?.velocityY ?? prev.velocityY,
          velocityZ: firstTarget?.velocityZ ?? prev.velocityZ,
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
      
      // Increase difficulty: smaller target and higher level
      const newLevel = Math.floor(newScore / 10) + 1;
      const newTargetSize = Math.max(
        MIN_TARGET_SIZE,
        BASE_TARGET_SIZE - (newLevel - 1) * 0.04
      );

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

      const firstTarget = updatedTargets[0];
      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        level: newLevel,
        targetSize: newTargetSize,
        targets: updatedTargets,
        successfulHits: prev.successfulHits + 1,
        totalClicks: prev.totalClicks + 1,
        // Keep backward compatibility
        playerX: firstTarget?.x ?? prev.playerX,
        playerY: firstTarget?.y ?? prev.playerY,
        playerZ: firstTarget?.z ?? prev.playerZ,
        velocityX: firstTarget?.velocityX ?? prev.velocityX,
        velocityY: firstTarget?.velocityY ?? prev.velocityY,
        velocityZ: firstTarget?.velocityZ ?? prev.velocityZ,
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
    const firstTarget = initialTargets[0];
    setGameState((prev) => ({
      score: 0,
      playerX: firstTarget?.x ?? 0,
      playerY: firstTarget?.y ?? 0,
      playerZ: firstTarget?.z ?? 0,
      velocityX: firstTarget?.velocityX ?? generateRandomVelocity(),
      velocityY: firstTarget?.velocityY ?? generateRandomVelocity(),
      velocityZ: firstTarget?.velocityZ ?? generateRandomVelocity(),
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
