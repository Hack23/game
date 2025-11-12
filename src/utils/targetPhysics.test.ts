import { describe, it, expect } from "vitest";
import {
  generateRandomVelocity,
  updateTargetPhysics,
  createTarget,
  PLAYER_X_RANGE,
  PLAYER_Y_RANGE,
  PLAYER_Z_RANGE,
} from "./targetPhysics";
import type { Target } from "../hooks/useGameState";

describe("targetPhysics utilities", () => {
  describe("generateRandomVelocity", () => {
    it("should generate velocity values", () => {
      const velocity = generateRandomVelocity();
      expect(velocity).toBeDefined();
      expect(typeof velocity).toBe("number");
    });

    it("should generate different values on multiple calls", () => {
      const velocities = new Set();
      for (let i = 0; i < 10; i++) {
        velocities.add(generateRandomVelocity());
      }
      // Should have at least some different values
      expect(velocities.size).toBeGreaterThan(1);
    });
  });

  describe("createTarget", () => {
    it("should create target with correct id", () => {
      const target = createTarget(5, 0.5);
      expect(target.id).toBe(5);
    });

    it("should create target with correct size", () => {
      const target = createTarget(0, 0.75);
      expect(target.size).toBe(0.75);
    });

    it("should create target with position within boundaries", () => {
      const target = createTarget(0, 0.5);
      
      expect(target.x).toBeGreaterThanOrEqual(-PLAYER_X_RANGE / 2);
      expect(target.x).toBeLessThanOrEqual(PLAYER_X_RANGE / 2);
      
      expect(target.y).toBeGreaterThanOrEqual(-PLAYER_Y_RANGE / 2);
      expect(target.y).toBeLessThanOrEqual(PLAYER_Y_RANGE / 2);
      
      expect(target.z).toBeGreaterThanOrEqual(-PLAYER_Z_RANGE / 2);
      expect(target.z).toBeLessThanOrEqual(PLAYER_Z_RANGE / 2);
    });

    it("should create target with velocities", () => {
      const target = createTarget(0, 0.5);
      
      expect(target.velocityX).toBeDefined();
      expect(target.velocityY).toBeDefined();
      expect(target.velocityZ).toBeDefined();
    });
  });

  describe("updateTargetPhysics", () => {
    it("should update position based on velocity and multiplier", () => {
      const target: Target = {
        id: 0,
        x: 0,
        y: 0,
        z: 0,
        velocityX: 0.1,
        velocityY: 0.1,
        velocityZ: 0.1,
        size: 0.5,
      };

      const updated = updateTargetPhysics(target, 1);
      
      expect(updated.x).toBeCloseTo(0.1, 2);
      expect(updated.y).toBeCloseTo(0.1, 2);
      expect(updated.z).toBeCloseTo(0.1, 2);
    });

    it("should apply speed multiplier correctly", () => {
      const target: Target = {
        id: 0,
        x: 0,
        y: 0,
        z: 0,
        velocityX: 0.1,
        velocityY: 0,
        velocityZ: 0,
        size: 0.5,
      };

      const updated = updateTargetPhysics(target, 2);
      
      expect(updated.x).toBeCloseTo(0.2, 2); // 0.1 * 2
    });

    it("should bounce off X boundaries", () => {
      const target: Target = {
        id: 0,
        x: PLAYER_X_RANGE / 2 - 0.01, // Near right boundary
        y: 0,
        z: 0,
        velocityX: 0.1, // Moving right
        velocityY: 0,
        velocityZ: 0,
        size: 0.5,
      };

      const updated = updateTargetPhysics(target, 1);
      
      // Should have bounced - velocity should be negative now
      expect(updated.velocityX).toBeLessThan(0);
      // Position should be clamped within boundary
      expect(updated.x).toBeLessThanOrEqual(PLAYER_X_RANGE / 2);
    });

    it("should bounce off Y boundaries", () => {
      const target: Target = {
        id: 0,
        x: 0,
        y: PLAYER_Y_RANGE / 2 - 0.01, // Near top boundary
        z: 0,
        velocityX: 0,
        velocityY: 0.1, // Moving up
        velocityZ: 0,
        size: 0.5,
      };

      const updated = updateTargetPhysics(target, 1);
      
      // Should have bounced
      expect(updated.velocityY).toBeLessThan(0);
      expect(updated.y).toBeLessThanOrEqual(PLAYER_Y_RANGE / 2);
    });

    it("should bounce off Z boundaries", () => {
      const target: Target = {
        id: 0,
        x: 0,
        y: 0,
        z: PLAYER_Z_RANGE / 2 - 0.01, // Near front boundary
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0.1, // Moving forward
        size: 0.5,
      };

      const updated = updateTargetPhysics(target, 1);
      
      // Should have bounced
      expect(updated.velocityZ).toBeLessThan(0);
      expect(updated.z).toBeLessThanOrEqual(PLAYER_Z_RANGE / 2);
    });

    it("should not modify size", () => {
      const target: Target = {
        id: 5,
        x: 0,
        y: 0,
        z: 0,
        velocityX: 0.1,
        velocityY: 0.1,
        velocityZ: 0.1,
        size: 0.75,
      };

      const updated = updateTargetPhysics(target, 1);
      
      expect(updated.size).toBe(0.75);
      expect(updated.id).toBe(5);
    });

    it("should handle multiple physics updates consistently", () => {
      let target: Target = createTarget(0, 0.5);
      
      // Run multiple physics updates
      for (let i = 0; i < 100; i++) {
        target = updateTargetPhysics(target, 1);
        
        // Position should always be within boundaries
        expect(target.x).toBeGreaterThanOrEqual(-PLAYER_X_RANGE / 2);
        expect(target.x).toBeLessThanOrEqual(PLAYER_X_RANGE / 2);
        expect(target.y).toBeGreaterThanOrEqual(-PLAYER_Y_RANGE / 2);
        expect(target.y).toBeLessThanOrEqual(PLAYER_Y_RANGE / 2);
        expect(target.z).toBeGreaterThanOrEqual(-PLAYER_Z_RANGE / 2);
        expect(target.z).toBeLessThanOrEqual(PLAYER_Z_RANGE / 2);
      }
    });
  });
});
