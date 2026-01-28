# Player3D Character System

## Overview

The Player3D character system provides realistic 3D humanoid characters with proper anatomy, clothing, and configurable physical attributes. This system addresses all the issues mentioned in the requirements:

- ✅ **Proper human anatomy** - Head, neck, torso, arms (with elbows), hands, pelvis, legs (with knees), feet
- ✅ **Realistic proportions** - Based on anatomical standards (head = 1/7.5 of height, etc.)
- ✅ **Clothing system** - Shirt/top and pants/bottom rendered on **all sides** (front and back)
- ✅ **Fixed "jojik" bubble-man** - Reduced BMI and limb thickness to normal human ranges
- ✅ **Human appearance** - Natural materials (low metalness, high roughness) to avoid robotic look
- ✅ **Configurable attributes** - Height, BMI, shoulder/hip width, head size, limb thickness

## Components

### Player3D

The main component for rendering a humanoid character.

```tsx
import { Player3D } from "./components";

function MyGame() {
  return (
    <Canvas>
      <Player3D
        position={[0, 0, 0]}
        physicalAttributes={{
          height: 1.80,
          bodyMassIndex: 23,
          shoulderWidth: 1.1,
          hipWidth: 0.85,
          headSize: 1.0,
          limbThickness: 1.05,
        }}
        clothing={{
          topColor: "#4a90e2",
          bottomColor: "#2c3e50",
          skinColor: "#ffdbac",
        }}
        name="Fighter1"
        isAnimating={true}
      />
    </Canvas>
  );
}
```

### Props

#### `position?: [number, number, number]`
Position in 3D space (default: `[0, 0, 0]`)

#### `physicalAttributes?: Partial<PhysicalAttributes>`
Physical characteristics of the character:

- `height` (number): Overall height in meters (1.6 - 2.0)
- `bodyMassIndex` (number): Body mass index affecting bulk (18 - 30)
- `shoulderWidth` (number): Shoulder width ratio (0.8 - 1.2)
- `hipWidth` (number): Hip width ratio (0.7 - 1.0)
- `headSize` (number): Head size ratio (0.9 - 1.1)
- `limbThickness` (number): Limb thickness ratio (0.8 - 1.2)

#### `clothing?: Partial<ClothingConfig>`
Clothing and appearance:

- `topColor` (string): Color of shirt/top
- `bottomColor` (string): Color of pants/bottom
- `skinColor` (string): Skin tone color
- `metalness` (number): Material metalness 0-1 (default: 0.1)
- `roughness` (number): Material roughness 0-1 (default: 0.8)

#### `name?: string`
Character name for identification (default: "Player")

#### `isAnimating?: boolean`
Enable idle breathing animation (default: false)

## Character Presets

Pre-configured character types with realistic proportions:

### Available Presets

#### `balanced`
Average proportions - completely balanced human
- Height: 1.75m
- BMI: 22 (normal)
- Standard proportions

#### `jojik` (FIXED)
**Previously had "bubble-man" proportions - now realistic!**
- Height: 1.75m
- BMI: 22 (reduced from ~30)
- Normal limb thickness (reduced from ~1.3)
- Fixed shoulder width (reduced from ~1.3)
- Looks like a real human now, not Michelin man

#### `athlete`
Athletic fighter build
- Height: 1.80m
- BMI: 23 (athletic)
- Broader shoulders, narrower hips
- Slightly muscular limbs

#### `tank`
Heavy, muscular fighter
- Height: 1.85m
- BMI: 26 (muscular/stocky)
- Very broad shoulders
- Thick limbs

#### `speedster`
Lean, agile fighter
- Height: 1.70m
- BMI: 20 (lean)
- Narrow shoulders and hips
- Thin, wiry limbs

#### `amazon`
Tall, athletic female proportions
- Height: 1.78m
- BMI: 23 (athletic)
- Female shoulder/hip ratios

#### `ninja`
Compact, stealthy build
- Height: 1.65m
- BMI: 21 (lean)
- Narrow build
- All black clothing

### Using Presets

```tsx
import { Player3D, CHARACTER_PRESETS } from "./components";

function CharacterLineup() {
  return (
    <Canvas>
      {/* Use jojik preset (fixed proportions) */}
      <Player3D
        position={[-2, 0, 0]}
        physicalAttributes={CHARACTER_PRESETS.jojik.physicalAttributes}
        clothing={CHARACTER_PRESETS.jojik.clothing}
        name={CHARACTER_PRESETS.jojik.name}
        isAnimating={true}
      />
      
      {/* Use athlete preset */}
      <Player3D
        position={[2, 0, 0]}
        physicalAttributes={CHARACTER_PRESETS.athlete.physicalAttributes}
        clothing={CHARACTER_PRESETS.athlete.clothing}
        name={CHARACTER_PRESETS.athlete.name}
        isAnimating={true}
      />
    </Canvas>
  );
}
```

## Anatomy and Body Parts

Each Player3D character includes all major body parts:

### Upper Body
- **Head**: Spherical geometry, scaled based on height (~1/7.5 of total height)
- **Neck**: Cylindrical connector between head and torso
- **Torso**: Box geometry for main body mass (covered by shirt/top)
- **Shoulders**: Spherical joints connecting arms to torso (covered by shirt)

### Arms
- **Upper Arms**: Cylindrical geometry (covered by shirt)
- **Elbows**: Spherical joints
- **Forearms**: Cylindrical geometry (exposed skin)
- **Hands**: Spherical geometry (exposed skin)

### Lower Body
- **Pelvis**: Box geometry for hip area (covered by pants)
- **Hip Joints**: Spherical connectors (covered by pants)
- **Upper Legs (Thighs)**: Cylindrical geometry (covered by pants)
- **Knees**: Spherical joints (covered by pants)
- **Lower Legs (Calves)**: Cylindrical geometry (covered by pants)
- **Feet**: Box geometry (exposed skin)

## Clothing System

The clothing system ensures clothes are rendered on **all sides** (front, back, sides):

### How It Works

1. **Torso (Shirt/Top)**: Uses box geometry that wraps around the entire torso
2. **Pelvis & Legs (Pants/Bottom)**: Uses box and cylinder geometries that wrap completely around lower body
3. **Materials**: Uses `meshStandardMaterial` which renders on all faces by default
4. **Coverage**: 
   - Shirt covers: torso, shoulders, upper arms
   - Pants cover: pelvis, hips, upper legs, knees, lower legs

### No "Flaky" Clothes

The original issue mentioned clothes being "flaky" and not on the back side. This is solved by:

- Using proper 3D geometries (not flat planes)
- Using materials that render on all faces
- Proper shadowing with `castShadow` enabled
- Natural lighting that shows all sides

## Physical Attributes Explained

### Height
- Affects all body part sizes proportionally
- Range: 1.6m - 2.0m (realistic human range)
- Average: 1.75m

### Body Mass Index (BMI)
- Affects overall "bulk" of the character
- Normal range: 18-30
- 18-20: Lean/thin
- 20-25: Normal/athletic
- 25-30: Muscular/stocky
- **Jojik was fixed by reducing BMI from ~30 to 22**

### Shoulder Width
- Ratio multiplier for shoulder breadth
- 0.9-1.0: Narrow (female, speedster)
- 1.0: Normal (balanced)
- 1.1-1.2: Broad (athlete, tank)

### Hip Width
- Ratio multiplier for hip breadth
- 0.7-0.8: Narrow hips (male, athletic)
- 0.85: Normal
- 0.9-1.0: Wide hips (female, stable stance)

### Head Size
- Ratio multiplier for head dimensions
- 0.95-0.98: Smaller head
- 1.0: Normal proportions
- 1.05-1.1: Larger head

### Limb Thickness
- Affects arm and leg thickness
- 0.8-0.9: Thin/wiry limbs
- 1.0: Normal
- 1.1-1.2: Thick/muscular limbs
- **Jojik was fixed by reducing from ~1.3 to 0.95**

## Material Settings

To avoid "robotic" appearance, use:

```tsx
clothing={{
  metalness: 0.1,  // Very low metalness (cloth, not metal)
  roughness: 0.8,  // High roughness (matte, not shiny)
}}
```

- **Low metalness (0.1-0.2)**: Makes materials look like cloth/skin, not metal
- **High roughness (0.7-0.9)**: Creates matte finish, not shiny/plastic
- **Proper lighting**: Requires ambient + directional lights to show form

## Demo Scene

Run the demo to see all characters:

```tsx
import { Player3DDemo } from "./components";

function App() {
  return <Player3DDemo />;
}
```

This shows 5 characters side-by-side:
1. Balanced - Average human
2. Jojik - Fixed proportions (no more bubble man!)
3. Athlete - Athletic build
4. Speedster - Lean & agile
5. Tank - Heavy & muscular

## Visual Comparison

### Before (Issues)
- ❌ Jojik looked like "Michelin bubble man"
- ❌ Characters looked robotic
- ❌ Clothes not on back side / flaky
- ❌ Missing body parts (no elbows, knees, etc.)
- ❌ Poor proportions

### After (Fixed)
- ✅ Jojik has normal human proportions
- ✅ Characters look human with natural materials
- ✅ Clothes render on all sides (front and back)
- ✅ All body parts present (elbows, knees, hands, feet)
- ✅ Realistic proportions based on anatomy

## Integration Example

Add characters to your game:

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Player3D, CHARACTER_PRESETS } from "./components";

function FightingGame() {
  return (
    <Canvas shadows>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
      
      {/* Fighter 1 - Jojik */}
      <Player3D
        position={[-3, 0, 0]}
        physicalAttributes={CHARACTER_PRESETS.jojik.physicalAttributes}
        clothing={CHARACTER_PRESETS.jojik.clothing}
        name="Jojik"
        isAnimating={true}
      />
      
      {/* Fighter 2 - Tank */}
      <Player3D
        position={[3, 0, 0]}
        physicalAttributes={CHARACTER_PRESETS.tank.physicalAttributes}
        clothing={CHARACTER_PRESETS.tank.clothing}
        name="Tank"
        isAnimating={true}
      />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Camera controls */}
      <OrbitControls />
    </Canvas>
  );
}
```

## Testing

Run tests to verify character system:

```bash
npm run test src/components/Player3D.test.tsx
```

Tests cover:
- Rendering with default props
- Custom physical attributes
- Custom clothing
- All character presets
- Regression tests for "bubble man" proportions
- Material properties
- Body part validation

## Customization

Create your own character:

```tsx
<Player3D
  position={[0, 0, 0]}
  physicalAttributes={{
    height: 1.82,           // Tall
    bodyMassIndex: 24,      // Athletic
    shoulderWidth: 1.15,    // Broad shoulders
    hipWidth: 0.8,          // Narrow hips
    headSize: 1.0,          // Normal head
    limbThickness: 1.1,     // Muscular limbs
  }}
  clothing={{
    topColor: "#8b0000",    // Dark red shirt
    bottomColor: "#000",    // Black pants
    skinColor: "#c68642",   // Tan skin
    metalness: 0.1,
    roughness: 0.85,
  }}
  name="MyFighter"
  isAnimating={true}
/>
```

## Performance

- Each character: ~50 mesh objects (optimized geometry)
- Shadows: Enabled by default (use `castShadow` and `receiveShadow`)
- Animation: Minimal CPU usage (simple breathing + sway)
- Multiple characters: Can render 10+ at 60fps

## Future Enhancements

Potential improvements:
- Facial features (eyes, nose, mouth)
- Hair geometry
- Advanced animation system (walk, run, fight)
- IK (Inverse Kinematics) for realistic movement
- Texture mapping for detailed clothing
- Accessories (hats, weapons, armor)
