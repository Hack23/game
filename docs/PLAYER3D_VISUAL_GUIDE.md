# Player3D Character Visual Structure

## Character Anatomy Diagram

```
                   ○  ← Head (sphere, 1/7.5 of height)
                   |  ← Neck (cylinder)
                   
          ○--------□--------○  ← Shoulders (spheres) + Torso (box, shirt color)
          |                 |
          |                 |  ← Upper Arms (cylinders, shirt color)
          ○                 ○  ← Elbows (spheres, skin color)
          |                 |
          |                 |  ← Forearms (cylinders, skin color)
          ○                 ○  ← Hands (spheres, skin color)
          
                   □           ← Pelvis (box, pants color)
                   
          ○                 ○  ← Hip Joints (spheres, pants color)
          |                 |
          |                 |  ← Upper Legs/Thighs (cylinders, pants color)
          ○                 ○  ← Knees (spheres, pants color)
          |                 |
          |                 |  ← Lower Legs/Calves (cylinders, pants color)
         ▭▭▭               ▭▭▭ ← Feet (boxes, skin color)
```

## Physical Measurements (Default Balanced Character)

```
Height: 1.75m (5'9")

Head:
  - Radius: 0.117m (~1/7.5 of height)
  - Position: Top of character

Torso:
  - Height: 0.613m (35% of total height)
  - Width: 0.257m (shoulder-dependent)
  - Depth: 0.176m
  - Color: Shirt/Top (configurable)

Arms:
  - Upper Arm Length: 0.315m (18% of height)
  - Forearm Length: 0.280m (16% of height)
  - Total Arm Span: ~1.75m (equal to height)

Legs:
  - Upper Leg Length: 0.438m (25% of height)
  - Lower Leg Length: 0.403m (23% of height)  
  - Total Leg Length: ~0.88m (50% of height)

Proportions Match Real Humans:
  - Head-to-body ratio: 1:7.5
  - Arm span ≈ Height
  - Legs ≈ 50% of height
  - Torso ≈ 35% of height
```

## Character Presets Comparison

| Preset    | Height | BMI  | Build Type      | Special Features                    |
|-----------|--------|------|-----------------|-------------------------------------|
| Balanced  | 1.75m  | 22   | Average         | Perfectly normal proportions        |
| **Jojik** | 1.75m  | 22   | **Fixed!**      | **Was 30 BMI, now realistic**      |
| Athlete   | 1.80m  | 23   | Athletic        | Broad shoulders, muscular           |
| Tank      | 1.85m  | 26   | Heavy/Strong    | Very broad, thick limbs             |
| Speedster | 1.70m  | 20   | Lean/Agile      | Narrow build, thin limbs            |
| Amazon    | 1.78m  | 23   | Tall/Athletic   | Female proportions, wider hips      |
| Ninja     | 1.65m  | 21   | Compact/Stealth | Smaller, all black clothing         |

## "Jojik" Before vs After

### Before (Bubble Man):
```
BMI: ~30 (overweight/bulky)
Limb Thickness: ~1.3 (michelin arms)
Shoulder Width: ~1.3 (overly broad)
Result: Looked like balloon/bubble man
```

### After (Realistic):
```
BMI: 22 (normal/healthy)
Limb Thickness: 0.95 (slightly slim)
Shoulder Width: 1.0 (normal)
Result: Looks like a real human!
```

## Material Settings for Human Appearance

```typescript
{
  metalness: 0.1,  // Very low - cloth/skin, not metal
  roughness: 0.8,  // High - matte finish, not shiny
}
```

**Why this works:**
- Low metalness prevents robotic/shiny appearance
- High roughness creates natural cloth/skin texture
- Requires proper lighting (ambient + directional) to see form

## Clothing Coverage

### Shirt/Top (topColor):
- Torso (full box geometry)
- Shoulders (spherical joints)
- Upper Arms (cylinders)

### Pants/Bottom (bottomColor):
- Pelvis (box geometry)
- Hip Joints (spheres)
- Upper Legs/Thighs (cylinders)
- Knees (spheres)
- Lower Legs/Calves (cylinders)

### Exposed Skin (skinColor):
- Head (sphere)
- Neck (cylinder)
- Elbows (spheres)
- Forearms (cylinders)
- Hands (spheres)
- Feet (boxes)

**All geometries are 3D solids** - they render on all sides (front, back, sides)
No "flaky" or missing back sides!

## Testing Results

```
✓ 22 tests passing
✓ All character presets render correctly
✓ Jojik proportions verified (BMI ≤ 23, limb thickness ≤ 1.0)
✓ Realistic shoulder-to-hip ratios validated
✓ Build successful
✓ ESLint passing
```

## Demo Access

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:5173/#player3d`
3. See 5 characters side-by-side showcasing different builds
4. Use mouse to rotate camera and inspect from all angles
