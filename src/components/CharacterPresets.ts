import type { PhysicalAttributes, ClothingConfig } from "./Player3D";

/**
 * Character preset configuration
 */
export interface CharacterPreset {
  name: string;
  physicalAttributes: PhysicalAttributes;
  clothing: ClothingConfig;
  description: string;
}

/**
 * Predefined character presets with realistic proportions
 */
export const CHARACTER_PRESETS: Record<string, CharacterPreset> = {
  /**
   * Standard athletic fighter - balanced proportions
   */
  athlete: {
    name: "Athlete",
    physicalAttributes: {
      height: 1.80, // 180cm
      bodyMassIndex: 23, // Athletic build
      shoulderWidth: 1.1, // Broader shoulders
      hipWidth: 0.8, // Narrower hips
      headSize: 1.0, // Normal head
      limbThickness: 1.05, // Slightly muscular
    },
    clothing: {
      topColor: "#2c5aa0", // Blue sports shirt
      bottomColor: "#1a1a1a", // Black pants
      skinColor: "#f4c49e", // Light skin tone
      metalness: 0.1,
      roughness: 0.85,
    },
    description: "Athletic build with balanced proportions - ideal fighter stance",
  },

  /**
   * Jojik - FIXED proportions (was "bubble man", now realistic)
   * Reduced BMI from excessive to normal range
   * Normalized limb thickness
   * Proper head-to-body ratio
   */
  jojik: {
    name: "Jojik",
    physicalAttributes: {
      height: 1.75, // 175cm - average height
      bodyMassIndex: 22, // FIXED: Normal BMI (was likely 28-30, causing bubble effect)
      shoulderWidth: 1.0, // FIXED: Normal shoulders (was likely 1.3+)
      hipWidth: 0.85, // Normal hip ratio
      headSize: 1.0, // FIXED: Normal head size (prevents bobblehead)
      limbThickness: 0.95, // FIXED: Slightly slimmer (was likely 1.3+, causing michelin arms)
    },
    clothing: {
      topColor: "#d35400", // Orange shirt
      bottomColor: "#34495e", // Gray pants
      skinColor: "#dda178", // Medium skin tone
      metalness: 0.1,
      roughness: 0.8,
    },
    description: "Jojik - Fixed bubble-man proportions, now realistic human",
  },

  /**
   * Tank - Heavier, stronger fighter
   */
  tank: {
    name: "Tank",
    physicalAttributes: {
      height: 1.85, // 185cm - tall
      bodyMassIndex: 26, // Muscular/stocky build
      shoulderWidth: 1.15, // Very broad shoulders
      hipWidth: 0.9, // Wider hips for stability
      headSize: 1.05, // Slightly larger head
      limbThickness: 1.15, // Thick, muscular limbs
    },
    clothing: {
      topColor: "#8b0000", // Dark red shirt
      bottomColor: "#2f2f2f", // Dark gray pants
      skinColor: "#c68642", // Tan skin tone
      metalness: 0.1,
      roughness: 0.9,
    },
    description: "Heavy, muscular build - tank-style fighter",
  },

  /**
   * Speedster - Lean, agile fighter
   */
  speedster: {
    name: "Speedster",
    physicalAttributes: {
      height: 1.70, // 170cm - shorter for agility
      bodyMassIndex: 20, // Lean build
      shoulderWidth: 0.95, // Narrower shoulders
      hipWidth: 0.75, // Narrow hips
      headSize: 0.98, // Slightly smaller head
      limbThickness: 0.85, // Thin, wiry limbs
    },
    clothing: {
      topColor: "#27ae60", // Green shirt
      bottomColor: "#1c2833", // Dark blue pants
      skinColor: "#e0ac69", // Light tan skin
      metalness: 0.1,
      roughness: 0.75,
    },
    description: "Lean, agile build - speed-focused fighter",
  },

  /**
   * Balanced fighter - completely average proportions
   */
  balanced: {
    name: "Balanced",
    physicalAttributes: {
      height: 1.75, // 175cm - average
      bodyMassIndex: 22, // Normal BMI
      shoulderWidth: 1.0, // Average shoulders
      hipWidth: 0.85, // Average hips
      headSize: 1.0, // Average head
      limbThickness: 1.0, // Average limbs
    },
    clothing: {
      topColor: "#3498db", // Blue shirt
      bottomColor: "#2c3e50", // Navy pants
      skinColor: "#ffdbac", // Fair skin tone
      metalness: 0.1,
      roughness: 0.8,
    },
    description: "Perfectly balanced proportions - average human",
  },

  /**
   * Amazon - Tall, strong female proportions
   */
  amazon: {
    name: "Amazon",
    physicalAttributes: {
      height: 1.78, // 178cm - tall
      bodyMassIndex: 23, // Athletic
      shoulderWidth: 0.95, // Narrower shoulders (female)
      hipWidth: 1.0, // Wider hips (female)
      headSize: 0.95, // Slightly smaller head
      limbThickness: 1.0, // Normal limb thickness
    },
    clothing: {
      topColor: "#9b59b6", // Purple shirt
      bottomColor: "#34495e", // Gray pants
      skinColor: "#d4a574", // Medium skin tone
      metalness: 0.1,
      roughness: 0.8,
    },
    description: "Tall, athletic female proportions - warrior build",
  },

  /**
   * Ninja - Small, compact, stealthy
   */
  ninja: {
    name: "Ninja",
    physicalAttributes: {
      height: 1.65, // 165cm - shorter
      bodyMassIndex: 21, // Lean
      shoulderWidth: 0.9, // Narrow shoulders
      hipWidth: 0.8, // Narrow hips
      headSize: 0.95, // Smaller head
      limbThickness: 0.9, // Thin limbs
    },
    clothing: {
      topColor: "#1a1a1a", // Black shirt
      bottomColor: "#0d0d0d", // Black pants
      skinColor: "#f5d0a9", // Light skin
      metalness: 0.15,
      roughness: 0.7,
    },
    description: "Compact, stealthy build - ninja proportions",
  },
};

/**
 * Get a character preset by name
 */
export function getCharacterPreset(name: string): CharacterPreset | undefined {
  return CHARACTER_PRESETS[name.toLowerCase()];
}

/**
 * Get all available character preset names
 */
export function getCharacterPresetNames(): string[] {
  return Object.keys(CHARACTER_PRESETS);
}

/**
 * Skin tone variations
 */
export const SKIN_TONES = {
  fair: "#ffdbac",
  light: "#f4c49e",
  lightTan: "#e0ac69",
  medium: "#dda178",
  tan: "#c68642",
  dark: "#8d5524",
  veryDark: "#5c4033",
} as const;

/**
 * Common clothing color schemes
 */
export const CLOTHING_SCHEMES = {
  warrior: {
    topColor: "#8b0000",
    bottomColor: "#2f2f2f",
  },
  casual: {
    topColor: "#4a90e2",
    bottomColor: "#2c3e50",
  },
  tactical: {
    topColor: "#2c5aa0",
    bottomColor: "#1a1a1a",
  },
  forest: {
    topColor: "#27ae60",
    bottomColor: "#1c2833",
  },
  stealth: {
    topColor: "#1a1a1a",
    bottomColor: "#0d0d0d",
  },
  royal: {
    topColor: "#9b59b6",
    bottomColor: "#34495e",
  },
} as const;
