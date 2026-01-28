import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { JSX } from "react";
import * as THREE from "three";

/**
 * Physical attributes that define a humanoid character's appearance
 */
export interface PhysicalAttributes {
  /** Overall height in meters (1.6 - 2.0) */
  height: number;
  /** Body mass index affecting proportions (18 - 30) */
  bodyMassIndex: number;
  /** Shoulder width ratio (0.8 - 1.2) */
  shoulderWidth: number;
  /** Hip width ratio (0.7 - 1.0) */
  hipWidth: number;
  /** Head size ratio (0.9 - 1.1) */
  headSize: number;
  /** Limb thickness ratio (0.8 - 1.2) */
  limbThickness: number;
}

/**
 * Clothing configuration for character appearance
 */
export interface ClothingConfig {
  /** Shirt/top color */
  topColor: string;
  /** Pants/bottom color */
  bottomColor: string;
  /** Skin tone color */
  skinColor: string;
  /** Material metalness (0-1) */
  metalness: number;
  /** Material roughness (0-1) */
  roughness: number;
}

export interface Player3DProps {
  /** Position in 3D space */
  position?: [number, number, number];
  /** Physical attributes defining body proportions */
  physicalAttributes?: Partial<PhysicalAttributes>;
  /** Clothing and appearance configuration */
  clothing?: Partial<ClothingConfig>;
  /** Character name for identification */
  name?: string;
  /** Animation state */
  isAnimating?: boolean;
}

/**
 * Default physical attributes for a balanced human character
 */
const DEFAULT_ATTRIBUTES: PhysicalAttributes = {
  height: 1.75, // Average human height in meters
  bodyMassIndex: 22, // Normal BMI
  shoulderWidth: 1.0,
  hipWidth: 0.85,
  headSize: 1.0,
  limbThickness: 1.0,
};

/**
 * Default clothing configuration
 */
const DEFAULT_CLOTHING: ClothingConfig = {
  topColor: "#4a90e2",
  bottomColor: "#2c3e50",
  skinColor: "#ffdbac",
  metalness: 0.1,
  roughness: 0.8,
};

/**
 * Calculate body part dimensions based on physical attributes
 */
function calculateDimensions(attributes: PhysicalAttributes): {
  headRadius: number;
  neckRadius: number;
  neckHeight: number;
  torsoHeight: number;
  torsoWidth: number;
  torsoDepth: number;
  shoulderRadius: number;
  shoulderOffset: number;
  upperArmLength: number;
  upperArmRadius: number;
  forearmLength: number;
  forearmRadius: number;
  handRadius: number;
  pelvisHeight: number;
  pelvisWidth: number;
  pelvisDepth: number;
  upperLegLength: number;
  upperLegRadius: number;
  lowerLegLength: number;
  lowerLegRadius: number;
  footLength: number;
  footWidth: number;
  footHeight: number;
} {
  const { height, bodyMassIndex, shoulderWidth, hipWidth, headSize, limbThickness } = attributes;
  
  // BMI affects overall bulk (normal BMI ~22, range 18-30)
  const bulkFactor = Math.max(0.7, Math.min(1.5, bodyMassIndex / 22));
  
  // Head: ~1/7.5 of total height for adults
  const headRadius = (height / 15) * headSize;
  
  // Neck: connects head to torso
  const neckRadius = headRadius * 0.4;
  const neckHeight = height * 0.05;
  
  // Torso: ~2.5 head heights
  const torsoHeight = height * 0.35;
  const torsoWidth = headRadius * 2.2 * shoulderWidth * bulkFactor;
  const torsoDepth = headRadius * 1.5 * bulkFactor;
  
  // Shoulders
  const shoulderRadius = headRadius * 0.5 * limbThickness * bulkFactor;
  const shoulderOffset = torsoWidth * 0.45;
  
  // Arms
  const upperArmLength = height * 0.18;
  const upperArmRadius = headRadius * 0.35 * limbThickness * bulkFactor;
  const forearmLength = height * 0.16;
  const forearmRadius = headRadius * 0.30 * limbThickness * bulkFactor;
  const handRadius = headRadius * 0.25 * limbThickness;
  
  // Pelvis/hips
  const pelvisHeight = height * 0.12;
  const pelvisWidth = torsoWidth * 0.85 * hipWidth;
  const pelvisDepth = torsoDepth * 0.9;
  
  // Legs
  const upperLegLength = height * 0.25;
  const upperLegRadius = headRadius * 0.45 * limbThickness * bulkFactor;
  const lowerLegLength = height * 0.23;
  const lowerLegRadius = headRadius * 0.35 * limbThickness * bulkFactor;
  const footLength = height * 0.12;
  const footWidth = headRadius * 0.5;
  const footHeight = headRadius * 0.4;
  
  return {
    headRadius,
    neckRadius,
    neckHeight,
    torsoHeight,
    torsoWidth,
    torsoDepth,
    shoulderRadius,
    shoulderOffset,
    upperArmLength,
    upperArmRadius,
    forearmLength,
    forearmRadius,
    handRadius,
    pelvisHeight,
    pelvisWidth,
    pelvisDepth,
    upperLegLength,
    upperLegRadius,
    lowerLegLength,
    lowerLegRadius,
    footLength,
    footWidth,
    footHeight,
  };
}

/**
 * Player3D component - A realistic humanoid character with proper anatomy and clothing
 * 
 * Features:
 * - Realistic human proportions based on anatomical standards
 * - Configurable physical attributes (height, BMI, proportions)
 * - Full clothing system (top, bottom) rendered on all sides
 * - Proper body parts: head, neck, torso, arms, hands, pelvis, legs, feet
 * - Natural materials to avoid robotic appearance
 */
export function Player3D({
  position = [0, 0, 0],
  physicalAttributes = {},
  clothing = {},
  name = "Player",
  isAnimating = false,
}: Player3DProps): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  
  // Merge with defaults
  const attributes = { ...DEFAULT_ATTRIBUTES, ...physicalAttributes };
  const clothingConfig = { ...DEFAULT_CLOTHING, ...clothing };
  
  // Calculate all dimensions
  const dims = calculateDimensions(attributes);
  
  // Calculate vertical positions (building from ground up)
  const baseY = position[1];
  const footY = baseY;
  const ankleY = footY + dims.footHeight;
  const kneeY = ankleY + dims.lowerLegLength;
  const hipY = kneeY + dims.upperLegLength;
  const waistY = hipY + dims.pelvisHeight;
  const shoulderY = waistY + dims.torsoHeight;
  const neckY = shoulderY + dims.neckHeight;
  const headY = neckY + dims.headRadius;
  
  // Idle animation
  useFrame((state) => {
    if (!isAnimating || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    // Gentle breathing motion
    groupRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
    // Slight sway
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
  });
  
  return (
    <group ref={groupRef} position={position} name={name}>
      {/* === HEAD === */}
      <mesh position={[0, headY, 0]} castShadow>
        <sphereGeometry args={[dims.headRadius, 32, 32]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === NECK === */}
      <mesh position={[0, neckY + dims.neckHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[dims.neckRadius, dims.neckRadius, dims.neckHeight, 16]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === TORSO (Shirt/Top) === */}
      <mesh position={[0, waistY + dims.torsoHeight / 2, 0]} castShadow>
        <boxGeometry args={[dims.torsoWidth, dims.torsoHeight, dims.torsoDepth]} />
        <meshStandardMaterial
          color={clothingConfig.topColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT SHOULDER === */}
      <mesh position={[-dims.shoulderOffset, shoulderY, 0]} castShadow>
        <sphereGeometry args={[dims.shoulderRadius, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.topColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT UPPER ARM === */}
      <mesh
        position={[-dims.shoulderOffset, shoulderY - dims.upperArmLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.upperArmRadius, dims.upperArmRadius, dims.upperArmLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.topColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT ELBOW === */}
      <mesh
        position={[-dims.shoulderOffset, shoulderY - dims.upperArmLength, 0]}
        castShadow
      >
        <sphereGeometry args={[dims.forearmRadius * 1.1, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT FOREARM === */}
      <mesh
        position={[-dims.shoulderOffset, shoulderY - dims.upperArmLength - dims.forearmLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.forearmRadius, dims.forearmRadius, dims.forearmLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT HAND === */}
      <mesh
        position={[-dims.shoulderOffset, shoulderY - dims.upperArmLength - dims.forearmLength - dims.handRadius, 0]}
        castShadow
      >
        <sphereGeometry args={[dims.handRadius, 12, 12]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT SHOULDER === */}
      <mesh position={[dims.shoulderOffset, shoulderY, 0]} castShadow>
        <sphereGeometry args={[dims.shoulderRadius, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.topColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT UPPER ARM === */}
      <mesh
        position={[dims.shoulderOffset, shoulderY - dims.upperArmLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.upperArmRadius, dims.upperArmRadius, dims.upperArmLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.topColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT ELBOW === */}
      <mesh
        position={[dims.shoulderOffset, shoulderY - dims.upperArmLength, 0]}
        castShadow
      >
        <sphereGeometry args={[dims.forearmRadius * 1.1, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT FOREARM === */}
      <mesh
        position={[dims.shoulderOffset, shoulderY - dims.upperArmLength - dims.forearmLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.forearmRadius, dims.forearmRadius, dims.forearmLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT HAND === */}
      <mesh
        position={[dims.shoulderOffset, shoulderY - dims.upperArmLength - dims.forearmLength - dims.handRadius, 0]}
        castShadow
      >
        <sphereGeometry args={[dims.handRadius, 12, 12]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === PELVIS (Pants/Bottom Top) === */}
      <mesh position={[0, hipY + dims.pelvisHeight / 2, 0]} castShadow>
        <boxGeometry args={[dims.pelvisWidth, dims.pelvisHeight, dims.pelvisDepth]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT HIP JOINT === */}
      <mesh position={[-dims.pelvisWidth * 0.25, hipY, 0]} castShadow>
        <sphereGeometry args={[dims.upperLegRadius * 1.1, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT UPPER LEG (Thigh) === */}
      <mesh
        position={[-dims.pelvisWidth * 0.25, hipY - dims.upperLegLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.upperLegRadius, dims.upperLegRadius * 0.9, dims.upperLegLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT KNEE === */}
      <mesh position={[-dims.pelvisWidth * 0.25, kneeY, 0]} castShadow>
        <sphereGeometry args={[dims.lowerLegRadius * 1.15, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT LOWER LEG (Calf) === */}
      <mesh
        position={[-dims.pelvisWidth * 0.25, kneeY - dims.lowerLegLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.lowerLegRadius, dims.lowerLegRadius * 0.8, dims.lowerLegLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === LEFT FOOT === */}
      <mesh
        position={[-dims.pelvisWidth * 0.25, footY + dims.footHeight / 2, dims.footLength * 0.15]}
        castShadow
      >
        <boxGeometry args={[dims.footWidth, dims.footHeight, dims.footLength]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT HIP JOINT === */}
      <mesh position={[dims.pelvisWidth * 0.25, hipY, 0]} castShadow>
        <sphereGeometry args={[dims.upperLegRadius * 1.1, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT UPPER LEG (Thigh) === */}
      <mesh
        position={[dims.pelvisWidth * 0.25, hipY - dims.upperLegLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.upperLegRadius, dims.upperLegRadius * 0.9, dims.upperLegLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT KNEE === */}
      <mesh position={[dims.pelvisWidth * 0.25, kneeY, 0]} castShadow>
        <sphereGeometry args={[dims.lowerLegRadius * 1.15, 16, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT LOWER LEG (Calf) === */}
      <mesh
        position={[dims.pelvisWidth * 0.25, kneeY - dims.lowerLegLength / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.lowerLegRadius, dims.lowerLegRadius * 0.8, dims.lowerLegLength, 16]} />
        <meshStandardMaterial
          color={clothingConfig.bottomColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
      
      {/* === RIGHT FOOT === */}
      <mesh
        position={[dims.pelvisWidth * 0.25, footY + dims.footHeight / 2, dims.footLength * 0.15]}
        castShadow
      >
        <boxGeometry args={[dims.footWidth, dims.footHeight, dims.footLength]} />
        <meshStandardMaterial
          color={clothingConfig.skinColor}
          metalness={clothingConfig.metalness}
          roughness={clothingConfig.roughness}
        />
      </mesh>
    </group>
  );
}
