import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Player3D } from "./Player3D";
import { CHARACTER_PRESETS } from "./CharacterPresets";
import type { JSX } from "react";

/**
 * Demo scene showcasing Player3D characters with different presets
 */
export function Player3DDemo(): JSX.Element {
  // Arrange characters in a line for comparison
  const characters = [
    { preset: CHARACTER_PRESETS.balanced, position: [-4, 0, 0] as [number, number, number] },
    { preset: CHARACTER_PRESETS.jojik, position: [-2, 0, 0] as [number, number, number] },
    { preset: CHARACTER_PRESETS.athlete, position: [0, 0, 0] as [number, number, number] },
    { preset: CHARACTER_PRESETS.speedster, position: [2, 0, 0] as [number, number, number] },
    { preset: CHARACTER_PRESETS.tank, position: [4, 0, 0] as [number, number, number] },
  ];

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        background: "rgba(0,0,0,0.8)",
        padding: "20px",
        borderRadius: "10px",
        color: "white",
        maxWidth: "400px",
      }}>
        <h2 style={{ margin: "0 0 10px 0", color: "#4a90e2" }}>Player3D Character Showcase</h2>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          <strong>Features:</strong>
        </p>
        <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "13px" }}>
          <li>✅ Realistic human proportions</li>
          <li>✅ Full body parts (head, neck, torso, arms, hands, legs, feet)</li>
          <li>✅ Clothing system (front and back sides)</li>
          <li>✅ Jojik fixed - no more bubble man!</li>
          <li>✅ Natural materials - looks human, not robotic</li>
          <li>✅ Configurable physical attributes</li>
        </ul>
        <p style={{ margin: "10px 0 5px 0", fontSize: "13px" }}>
          <strong>Characters (left to right):</strong>
        </p>
        <ol style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "12px" }}>
          <li>Balanced - Average proportions</li>
          <li>Jojik - Fixed realistic build</li>
          <li>Athlete - Athletic fighter</li>
          <li>Speedster - Lean & agile</li>
          <li>Tank - Heavy & muscular</li>
        </ol>
        <p style={{ margin: "10px 0 0 0", fontSize: "11px", color: "#aaa" }}>
          Use mouse to orbit camera and zoom
        </p>
      </div>

      <Canvas camera={{ position: [0, 1.5, 8], fov: 60 }} shadows>
        {/* Lighting setup for natural appearance */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.6}
          penumbra={1}
          intensity={0.3}
          castShadow
        />

        {/* Characters */}
        {characters.map((char, index) => {
          const preset = char.preset;
          if (!preset) throw new Error("Preset is undefined");
          return (
            <Player3D
              key={index}
              position={char.position}
              physicalAttributes={preset.physicalAttributes}
              clothing={preset.clothing}
              name={preset.name}
              isAnimating={true}
            />
          );
        })}

        {/* Grid floor */}
        <Grid
          args={[20, 20]}
          position={[0, 0, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#6e6e6e"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#9d9d9d"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid={false}
        />

        {/* Ground plane for shadows */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  );
}
