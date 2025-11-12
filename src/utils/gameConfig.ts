/**
 * Game configuration constants and utilities
 */

// Game timing configuration
export const GAME_DURATION = 60; // 60 seconds
export const COMBO_TIMEOUT = 2000; // 2 seconds to maintain combo

// Target size configuration
export const BASE_TARGET_SIZE = 0.5;
export const MIN_TARGET_SIZE = 0.25;
export const TARGET_SIZE_REDUCTION_PER_LEVEL = 0.04;

// Level progression configuration
export const POINTS_PER_LEVEL = 10; // Points needed to advance to next level

/**
 * Calculate number of targets based on level
 * @param level - Current game level
 * @returns Number of targets that should be active
 */
export function getTargetCountForLevel(level: number): number {
  if (level <= 3) return 1;
  if (level <= 6) return 2;
  return 3;
}

/**
 * Calculate target size based on level
 * @param level - Current game level
 * @returns Target size for the level
 */
export function getTargetSizeForLevel(level: number): number {
  return Math.max(
    MIN_TARGET_SIZE,
    BASE_TARGET_SIZE - (level - 1) * TARGET_SIZE_REDUCTION_PER_LEVEL
  );
}

/**
 * Calculate level based on score
 * @param score - Current score
 * @returns Current level
 */
export function calculateLevel(score: number): number {
  return Math.floor(score / POINTS_PER_LEVEL) + 1;
}

/**
 * Calculate speed multiplier based on level
 * @param level - Current game level
 * @returns Speed multiplier
 */
export function getSpeedMultiplierForLevel(level: number): number {
  return 1 + (level - 1) * 0.15;
}

/**
 * Calculate accuracy percentage
 * @param successfulHits - Number of successful hits
 * @param totalClicks - Total number of clicks
 * @returns Accuracy percentage (0-100)
 */
export function calculateAccuracy(successfulHits: number, totalClicks: number): number {
  if (totalClicks === 0) return 100;
  return Math.round((successfulHits / totalClicks) * 100);
}
