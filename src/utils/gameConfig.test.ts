import { describe, it, expect } from "vitest";
import {
  getTargetCountForLevel,
  getTargetSizeForLevel,
  calculateLevel,
  getSpeedMultiplierForLevel,
  calculateAccuracy,
  BASE_TARGET_SIZE,
  MIN_TARGET_SIZE,
  POINTS_PER_LEVEL,
} from "./gameConfig";

describe("gameConfig utilities", () => {
  describe("getTargetCountForLevel", () => {
    it("should return 1 target for levels 1-3", () => {
      expect(getTargetCountForLevel(1)).toBe(1);
      expect(getTargetCountForLevel(2)).toBe(1);
      expect(getTargetCountForLevel(3)).toBe(1);
    });

    it("should return 2 targets for levels 4-6", () => {
      expect(getTargetCountForLevel(4)).toBe(2);
      expect(getTargetCountForLevel(5)).toBe(2);
      expect(getTargetCountForLevel(6)).toBe(2);
    });

    it("should return 3 targets for levels 7+", () => {
      expect(getTargetCountForLevel(7)).toBe(3);
      expect(getTargetCountForLevel(10)).toBe(3);
      expect(getTargetCountForLevel(100)).toBe(3);
    });
  });

  describe("getTargetSizeForLevel", () => {
    it("should return base size for level 1", () => {
      expect(getTargetSizeForLevel(1)).toBe(BASE_TARGET_SIZE);
    });

    it("should decrease size as level increases", () => {
      const level1Size = getTargetSizeForLevel(1);
      const level2Size = getTargetSizeForLevel(2);
      const level3Size = getTargetSizeForLevel(3);
      
      expect(level2Size).toBeLessThan(level1Size);
      expect(level3Size).toBeLessThan(level2Size);
    });

    it("should not go below minimum size", () => {
      // At very high levels, size should be clamped to minimum
      expect(getTargetSizeForLevel(100)).toBe(MIN_TARGET_SIZE);
    });
  });

  describe("calculateLevel", () => {
    it("should return level 1 for scores 0-9", () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(5)).toBe(1);
      expect(calculateLevel(9)).toBe(1);
    });

    it("should return level 2 for scores 10-19", () => {
      expect(calculateLevel(10)).toBe(2);
      expect(calculateLevel(15)).toBe(2);
      expect(calculateLevel(19)).toBe(2);
    });

    it("should return level 3 for scores 20-29", () => {
      expect(calculateLevel(20)).toBe(3);
      expect(calculateLevel(25)).toBe(3);
      expect(calculateLevel(29)).toBe(3);
    });

    it("should calculate level correctly using points per level constant", () => {
      const score = 35;
      const expectedLevel = Math.floor(score / POINTS_PER_LEVEL) + 1;
      expect(calculateLevel(score)).toBe(expectedLevel);
    });
  });

  describe("getSpeedMultiplierForLevel", () => {
    it("should return 1.0 for level 1", () => {
      expect(getSpeedMultiplierForLevel(1)).toBe(1);
    });

    it("should increase speed multiplier as level increases", () => {
      const level1Speed = getSpeedMultiplierForLevel(1);
      const level2Speed = getSpeedMultiplierForLevel(2);
      const level3Speed = getSpeedMultiplierForLevel(3);
      
      expect(level2Speed).toBeGreaterThan(level1Speed);
      expect(level3Speed).toBeGreaterThan(level2Speed);
    });

    it("should calculate correct multiplier", () => {
      // Formula: 1 + (level - 1) * 0.15
      expect(getSpeedMultiplierForLevel(2)).toBeCloseTo(1.15, 2);
      expect(getSpeedMultiplierForLevel(3)).toBeCloseTo(1.3, 2);
      expect(getSpeedMultiplierForLevel(10)).toBeCloseTo(2.35, 2);
    });
  });

  describe("calculateAccuracy", () => {
    it("should return 100% for no clicks", () => {
      expect(calculateAccuracy(0, 0)).toBe(100);
    });

    it("should return 100% for perfect accuracy", () => {
      expect(calculateAccuracy(10, 10)).toBe(100);
    });

    it("should return 50% for half accuracy", () => {
      expect(calculateAccuracy(5, 10)).toBe(50);
    });

    it("should return 0% for no hits", () => {
      expect(calculateAccuracy(0, 10)).toBe(0);
    });

    it("should round to nearest integer", () => {
      expect(calculateAccuracy(1, 3)).toBe(33); // 33.333...
      expect(calculateAccuracy(2, 3)).toBe(67); // 66.666...
    });
  });
});
