import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, beforeAll } from "vitest";
import { Player3D } from "./Player3D";
import { CHARACTER_PRESETS } from "./CharacterPresets";

// Mock ResizeObserver for Canvas component
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
});

describe("Player3D", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <Canvas>
        <Player3D />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it("should render with default attributes", () => {
    const { container } = render(
      <Canvas>
        <Player3D position={[0, 0, 0]} />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it("should render with custom physical attributes", () => {
    const { container } = render(
      <Canvas>
        <Player3D
          position={[1, 2, 3]}
          physicalAttributes={{
            height: 1.8,
            bodyMassIndex: 25,
            shoulderWidth: 1.1,
            hipWidth: 0.9,
            headSize: 1.05,
            limbThickness: 1.1,
          }}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it("should render with custom clothing", () => {
    const { container } = render(
      <Canvas>
        <Player3D
          clothing={{
            topColor: "#ff0000",
            bottomColor: "#0000ff",
            skinColor: "#ffcc99",
            metalness: 0.2,
            roughness: 0.7,
          }}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it("should render with character name", () => {
    const { container } = render(
      <Canvas>
        <Player3D name="TestCharacter" />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it("should render with animation enabled", () => {
    const { container } = render(
      <Canvas>
        <Player3D isAnimating={true} />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  describe("Character Presets", () => {
    it("should render balanced preset", () => {
      const preset = CHARACTER_PRESETS.balanced;
      expect(preset).toBeDefined();
      if (!preset) throw new Error("Preset is undefined");
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={preset.physicalAttributes}
            clothing={preset.clothing}
            name={preset.name}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should render jojik preset with fixed proportions", () => {
      const preset = CHARACTER_PRESETS.jojik;
      expect(preset).toBeDefined();
      if (!preset) throw new Error("Preset is undefined");
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={preset.physicalAttributes}
            clothing={preset.clothing}
            name={preset.name}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
      
      // Verify jojik has normal proportions (not bubble man)
      const jojikAttrs = preset.physicalAttributes;
      expect(jojikAttrs.bodyMassIndex).toBeLessThanOrEqual(23); // Normal BMI range
      expect(jojikAttrs.limbThickness).toBeLessThanOrEqual(1.0); // Not overly thick
      expect(jojikAttrs.shoulderWidth).toBeLessThanOrEqual(1.05); // Not overly broad
    });

    it("should render athlete preset", () => {
      const preset = CHARACTER_PRESETS.athlete;
      expect(preset).toBeDefined();
      if (!preset) throw new Error("Preset is undefined");
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={preset.physicalAttributes}
            clothing={preset.clothing}
            name={preset.name}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should render tank preset", () => {
      const preset = CHARACTER_PRESETS.tank;
      expect(preset).toBeDefined();
      if (!preset) throw new Error("Preset is undefined");
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={preset.physicalAttributes}
            clothing={preset.clothing}
            name={preset.name}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should render speedster preset", () => {
      const preset = CHARACTER_PRESETS.speedster;
      expect(preset).toBeDefined();
      if (!preset) throw new Error("Preset is undefined");
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={preset.physicalAttributes}
            clothing={preset.clothing}
            name={preset.name}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should render amazon preset", () => {
      const preset = CHARACTER_PRESETS.amazon;
      expect(preset).toBeDefined();
      if (!preset) throw new Error("Preset is undefined");
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={preset.physicalAttributes}
            clothing={preset.clothing}
            name={preset.name}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should render ninja preset", () => {
      const preset = CHARACTER_PRESETS.ninja;
      expect(preset).toBeDefined();
      if (!preset) throw new Error("Preset is undefined");
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={preset.physicalAttributes}
            clothing={preset.clothing}
            name={preset.name}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });
  });

  describe("Physical Attributes Validation", () => {
    it("should handle extreme height values", () => {
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={{
              height: 2.0, // Very tall
              bodyMassIndex: 22,
              shoulderWidth: 1.0,
              hipWidth: 0.85,
              headSize: 1.0,
              limbThickness: 1.0,
            }}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should handle lean body type", () => {
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={{
              height: 1.75,
              bodyMassIndex: 18, // Lean
              shoulderWidth: 0.9,
              hipWidth: 0.75,
              headSize: 0.95,
              limbThickness: 0.85,
            }}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should handle heavy body type", () => {
      const { container } = render(
        <Canvas>
          <Player3D
            physicalAttributes={{
              height: 1.85,
              bodyMassIndex: 28, // Heavy
              shoulderWidth: 1.15,
              hipWidth: 1.0,
              headSize: 1.05,
              limbThickness: 1.2,
            }}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });
  });

  describe("Clothing Configuration", () => {
    it("should render with different skin tones", () => {
      const skinTones = ["#ffdbac", "#f4c49e", "#dda178", "#8d5524"];
      
      skinTones.forEach((skinColor) => {
        const { container } = render(
          <Canvas>
            <Player3D
              clothing={{
                topColor: "#4a90e2",
                bottomColor: "#2c3e50",
                skinColor,
              }}
            />
          </Canvas>
        );
        expect(container).toBeTruthy();
      });
    });

    it("should render with different clothing colors", () => {
      const { container } = render(
        <Canvas>
          <Player3D
            clothing={{
              topColor: "#8b0000", // Dark red
              bottomColor: "#000080", // Navy blue
              skinColor: "#ffdbac",
            }}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });

    it("should render with material properties", () => {
      const { container } = render(
        <Canvas>
          <Player3D
            clothing={{
              topColor: "#4a90e2",
              bottomColor: "#2c3e50",
              skinColor: "#ffdbac",
              metalness: 0.3,
              roughness: 0.6,
            }}
          />
        </Canvas>
      );
      expect(container).toBeTruthy();
    });
  });

  describe("Regression Tests", () => {
    it("should not create bubble-man proportions", () => {
      // Test that all presets have reasonable BMI values
      Object.values(CHARACTER_PRESETS).forEach((preset) => {
        expect(preset.physicalAttributes.bodyMassIndex).toBeGreaterThanOrEqual(18);
        expect(preset.physicalAttributes.bodyMassIndex).toBeLessThanOrEqual(30);
      });
    });

    it("should have realistic limb thickness ratios", () => {
      // Test that limb thickness is within reasonable bounds
      Object.values(CHARACTER_PRESETS).forEach((preset) => {
        expect(preset.physicalAttributes.limbThickness).toBeGreaterThanOrEqual(0.7);
        expect(preset.physicalAttributes.limbThickness).toBeLessThanOrEqual(1.3);
      });
    });

    it("should have realistic shoulder to hip ratios", () => {
      // Test proportions are human-like
      Object.values(CHARACTER_PRESETS).forEach((preset) => {
        expect(preset.physicalAttributes.shoulderWidth).toBeGreaterThanOrEqual(0.8);
        expect(preset.physicalAttributes.shoulderWidth).toBeLessThanOrEqual(1.3);
        expect(preset.physicalAttributes.hipWidth).toBeGreaterThanOrEqual(0.7);
        expect(preset.physicalAttributes.hipWidth).toBeLessThanOrEqual(1.1);
      });
    });
  });
});
