import type { Target } from "../hooks/useGameState";

// Game spatial boundaries for target position
export const PLAYER_X_RANGE = 4; // Range: -2 to +2
export const PLAYER_Y_RANGE = 3; // Range: -1.5 to +1.5
export const PLAYER_Z_RANGE = 2; // Range: -1 to +1

// Physics constants
const BASE_SPEED = 0.02; // Base speed for ball movement
const BOUNCE_RANDOMIZATION = 0.1; // Randomization factor for bounces
const BOUNCE_DAMPING = 0.95; // Energy loss on bounce

/**
 * Generate a random velocity for target movement
 * @returns Random velocity value
 */
export function generateRandomVelocity(): number {
  return (Math.random() - 0.5) * BASE_SPEED * 2;
}

/**
 * Check if position is outside boundary and calculate bounce
 * @param position - Current position
 * @param velocity - Current velocity
 * @param halfRange - Half of the allowed range
 * @returns Updated position and velocity after bounce
 */
function checkBoundaryAndBounce(
  position: number,
  velocity: number,
  halfRange: number
): { position: number; velocity: number } {
  let newPosition = position;
  let newVelocity = velocity;

  if (newPosition > halfRange || newPosition < -halfRange) {
    newVelocity = -velocity * (BOUNCE_DAMPING + Math.random() * BOUNCE_RANDOMIZATION);
    newPosition = Math.max(-halfRange, Math.min(halfRange, newPosition));
  }

  return { position: newPosition, velocity: newVelocity };
}

/**
 * Update target position and handle boundary collisions
 * @param target - Target to update
 * @param speedMultiplier - Speed multiplier based on level
 * @returns Updated target with new position and velocity
 */
export function updateTargetPhysics(target: Target, speedMultiplier: number): Target {
  // Calculate new positions
  let newX = target.x + target.velocityX * speedMultiplier;
  let newY = target.y + target.velocityY * speedMultiplier;
  let newZ = target.z + target.velocityZ * speedMultiplier;

  let newVelocityX = target.velocityX;
  let newVelocityY = target.velocityY;
  let newVelocityZ = target.velocityZ;

  // Check boundaries and apply bounces
  const xBounce = checkBoundaryAndBounce(newX, newVelocityX, PLAYER_X_RANGE / 2);
  newX = xBounce.position;
  newVelocityX = xBounce.velocity;

  const yBounce = checkBoundaryAndBounce(newY, newVelocityY, PLAYER_Y_RANGE / 2);
  newY = yBounce.position;
  newVelocityY = yBounce.velocity;

  const zBounce = checkBoundaryAndBounce(newZ, newVelocityZ, PLAYER_Z_RANGE / 2);
  newZ = zBounce.position;
  newVelocityZ = zBounce.velocity;

  return {
    ...target,
    x: newX,
    y: newY,
    z: newZ,
    velocityX: newVelocityX,
    velocityY: newVelocityY,
    velocityZ: newVelocityZ,
  };
}

/**
 * Create a new target with random position and velocity
 * @param id - Target identifier
 * @param size - Target size
 * @returns New target object
 */
export function createTarget(id: number, size: number): Target {
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
