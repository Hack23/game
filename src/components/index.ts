/**
 * Player3D Components
 * 
 * Comprehensive 3D humanoid character system with:
 * - Realistic human anatomy and proportions
 * - Configurable physical attributes (height, BMI, body ratios)
 * - Full clothing system (shirt, pants) rendered on all sides
 * - Multiple character presets (balanced, jojik, athlete, tank, speedster, etc.)
 * - Natural materials to avoid robotic appearance
 */

export { Player3D } from "./Player3D";
export type { Player3DProps, PhysicalAttributes, ClothingConfig } from "./Player3D";

export {
  CHARACTER_PRESETS,
  getCharacterPreset,
  getCharacterPresetNames,
  SKIN_TONES,
  CLOTHING_SCHEMES,
} from "./CharacterPresets";
export type { CharacterPreset } from "./CharacterPresets";

export { Player3DDemo } from "./Player3DDemo";
