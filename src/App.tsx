import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useCallback, useState, useRef } from "react";
import type { JSX } from "react";
import * as THREE from "three";
import "./App.css";

interface GameState {
  score: number;
  playerX: number;
  playerY: number;
  playerZ: number;
  isPlaying: boolean;
}

// Add a custom hook to manage game state for better testability
function useGameState(initialState?: Partial<GameState>): {
  gameState: GameState;
  incrementScore: () => void;
  resetGame: () => void;
  togglePause: () => void;
} {
  const [gameState, setGameState] = useState<GameState>({
    score: initialState?.score ?? 0,
    playerX: initialState?.playerX ?? 0,
    playerY: initialState?.playerY ?? 0,
    playerZ: initialState?.playerZ ?? 0,
    isPlaying: initialState?.isPlaying ?? true,
  });

  const incrementScore = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      playerX: Math.random() * 4 - 2,
      playerY: Math.random() * 3 - 1.5,
      playerZ: Math.random() * 2 - 1,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      playerX: 0,
      playerY: 0,
      playerZ: 0,
      isPlaying: true,
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  return {
    gameState,
    incrementScore,
    resetGame,
    togglePause,
  };
}

interface TargetSphereProps {
  position: [number, number, number];
  onClick: () => void;
  isActive: boolean;
}

function TargetSphere({ position, onClick, isActive }: TargetSphereProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isActive) {
      onClick();
    }
  }, [isActive, onClick]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => isActive && setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={isActive ? (hovered ? 1.2 : 1) : 0.6}
      data-testid="target-sphere"
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={isActive ? (hovered ? "#00ff88" : "#00cc66") : "#666666"}
        emissive={isActive ? "#00ff88" : "#333333"}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        metalness={0.3}
        roughness={0.4}
      />
      {/* Rings for target effect */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.35, 0.02, 16, 32]} />
        <meshStandardMaterial
          color={isActive ? "#ffffff" : "#999999"}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.2, 0.02, 16, 32]} />
        <meshStandardMaterial
          color={isActive ? "#ffffff" : "#999999"}
          transparent
          opacity={0.8}
        />
      </mesh>
    </mesh>
  );
}

function GameScene(): JSX.Element {
  const { gameState, incrementScore, resetGame, togglePause } = useGameState();

  const handleTargetClick = useCallback(() => {
    if (!gameState.isPlaying) return;
    incrementScore();
  }, [gameState.isPlaying, incrementScore]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Target Sphere */}
      <TargetSphere
        position={[gameState.playerX, gameState.playerY, gameState.playerZ]}
        onClick={handleTargetClick}
        isActive={gameState.isPlaying}
      />

      {/* Grid floor */}
      <gridHelper args={[10, 10, "#30363d", "#21262d"]} position={[0, -2, 0]} />

      {/* Score Display */}
      <Html
        position={[0, 3, 0]}
        center
        distanceFactor={8}
        data-testid="score-display"
      >
        <div
          style={{
            background: "rgba(33, 38, 45, 0.9)",
            padding: "20px 40px",
            borderRadius: "20px",
            textAlign: "center",
            minWidth: "200px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              color: "#7d8590",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
            data-testid="score-label"
          >
            SCORE
          </div>
          <div
            style={{
              color: "#00ff88",
              fontSize: "48px",
              fontWeight: "bold",
            }}
            data-testid="score-value"
            data-score={gameState.score.toString()}
          >
            {gameState.score}
          </div>
        </div>
      </Html>

      {/* Status indicator */}
      <Html
        position={[-4, 2.5, 0]}
        distanceFactor={10}
        data-testid="game-status-container"
      >
        <div
          style={{
            color: gameState.isPlaying ? "#00ff88" : "#ffa500",
            fontSize: "14px",
            fontWeight: "bold",
            background: "rgba(33, 38, 45, 0.9)",
            padding: "8px 16px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
          data-testid="game-status"
        >
          {gameState.isPlaying ? "🎯 Active" : "⏸️ Paused"}
        </div>
      </Html>

      {/* Instructions */}
      <Html
        position={[0, -3, 0]}
        center
        distanceFactor={10}
        data-testid="instructions"
      >
        <div
          style={{
            color: gameState.isPlaying ? "#ffffff" : "#7d8590",
            fontSize: "16px",
            background: "rgba(33, 38, 45, 0.9)",
            padding: "12px 20px",
            borderRadius: "12px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
          data-testid="instructions-text"
        >
          {gameState.isPlaying
            ? "🎯 Click the target to score points!"
            : "⏸️ Game paused - Resume to continue"}
        </div>
      </Html>

      {/* Control buttons */}
      <Html
        position={[4, 2.5, 0]}
        distanceFactor={10}
        data-testid="controls-container"
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={togglePause}
            data-testid="pause-button"
            style={{
              background: gameState.isPlaying ? "#ff6b35" : "#00c851",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {gameState.isPlaying ? "Pause" : "Resume"}
          </button>
          <button
            onClick={resetGame}
            data-testid="reset-button"
            style={{
              background: "#7c3aed",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            🔄 Reset
          </button>
        </div>
      </Html>

      {/* Pause overlay */}
      {!gameState.isPlaying && (
        <Html position={[0, 0, 0]} center distanceFactor={5}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              padding: "40px 60px",
              borderRadius: "20px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
            data-testid="pause-overlay"
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>⏸️</div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              data-testid="pause-title"
            >
              GAME PAUSED
            </div>
          </div>
        </Html>
      )}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

function App(): JSX.Element {
  return (
    <div className="app-container" data-testid="app-container">
      <h1 data-testid="app-title">Three.js React Game</h1>
      <div
        data-testid="threejs-canvas-container"
        style={{ width: "100%", height: "600px" }}
      >
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          style={{ background: "#0d1117" }}
          data-testid="threejs-canvas"
        >
          <GameScene />
        </Canvas>
      </div>
      <p className="instructions" data-testid="app-instructions">
        A minimal Three.js game built with @react-three/fiber and @react-three/drei
      </p>
    </div>
  );
}

export default App;
