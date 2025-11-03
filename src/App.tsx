import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Trail } from "@react-three/drei";
import { useRef, useState, useCallback, useEffect } from "react";
import type { JSX } from "react";
import * as THREE from "three";
import { useGameState, type GameState } from "./hooks/useGameState";
import { useAudioManager } from "./hooks/useAudioManager";
import "./App.css";

interface TargetSphereProps {
  position: [number, number, number];
  onClick: () => void;
  isActive: boolean;
  size: number;
}

function TargetSphere({ position, onClick, isActive, size }: TargetSphereProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Only rotate the target - position is controlled by parent
  useFrame(() => {
    if (!isActive || !meshRef.current) return;
    
    meshRef.current.rotation.y += 0.02;
    meshRef.current.rotation.x += 0.01;
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isActive) {
      onClick();
    }
  }, [isActive, onClick]);

  return (
    <group position={position}>
      <Trail
        width={3}
        length={6}
        color={isActive ? "#00ff88" : "#666666"}
        attenuation={(t) => t * t}
      >
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={() => isActive && setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={isActive ? (hovered ? 1.3 : 1) : 0.6}
          data-testid="target-sphere"
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={isActive ? (hovered ? "#00ff88" : "#00cc66") : "#666666"}
            emissive={isActive ? "#00ff88" : "#333333"}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.5}
            roughness={0.2}
          />
          {/* Animated rings for target effect */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.7, 0.02, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? "#ffffff" : "#999999"}
              transparent
              opacity={0.8}
              emissive="#ffffff"
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.4, 0.02, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? "#ffffff" : "#999999"}
              transparent
              opacity={0.8}
              emissive="#ffffff"
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </mesh>
        </mesh>
      </Trail>
      {/* Sparkle effect around target */}
      {isActive && (
        <Sparkles
          count={20}
          scale={size * 3}
          size={2}
          speed={0.4}
          color="#00ff88"
        />
      )}
    </group>
  );
}

function BackgroundParticles(): JSX.Element {
  return (
    <Sparkles
      count={100}
      scale={15}
      size={1}
      speed={0.2}
      opacity={0.3}
      color="#646cff"
    />
  );
}

interface GameSceneProps {
  gameState: GameState;
  onTargetClick: () => void;
}

function GameScene({ gameState, onTargetClick }: GameSceneProps): JSX.Element {
  const handleTargetClick = useCallback(() => {
    if (!gameState.isPlaying || gameState.timeLeft <= 0) return;
    onTargetClick();
  }, [gameState.isPlaying, gameState.timeLeft, onTargetClick]);

  const isGameOver = gameState.timeLeft <= 0;

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#646cff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        castShadow
        color="#00ff88"
      />

      {/* Background particles */}
      <BackgroundParticles />

      {/* Target Sphere */}
      <TargetSphere
        position={[gameState.playerX, gameState.playerY, gameState.playerZ]}
        onClick={handleTargetClick}
        isActive={gameState.isPlaying && !isGameOver}
        size={gameState.targetSize}
      />

      {/* Improved Grid floor with glow */}
      <gridHelper args={[10, 10, "#30363d", "#21262d"]} position={[0, -2, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0d1117" opacity={0.8} transparent />
      </mesh>

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
  const { gameState, incrementScore, resetGame, togglePause } = useGameState();
  const audioManager = useAudioManager();
  const [isMuted, setIsMuted] = useState(false);
  const prevLevelRef = useRef(gameState.level);
  const prevComboRef = useRef(gameState.combo);

  // Play background music when game starts
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0 && !isMuted) {
      audioManager.startBackgroundMusic();
    } else {
      audioManager.stopBackgroundMusic();
    }

    return (): void => {
      audioManager.stopBackgroundMusic();
    };
  }, [gameState.isPlaying, gameState.timeLeft, isMuted, audioManager]);

  // Play game over sound
  useEffect(() => {
    if (gameState.timeLeft === 0 && !isMuted) {
      audioManager.playGameOverSound();
    }
  }, [gameState.timeLeft, isMuted, audioManager]);

  // Play level up sound
  useEffect(() => {
    if (gameState.level > prevLevelRef.current && !isMuted) {
      audioManager.playLevelUpSound();
    }
    prevLevelRef.current = gameState.level;
  }, [gameState.level, isMuted, audioManager]);

  // Play combo sound (on every 5th combo)
  useEffect(() => {
    if (gameState.combo > 0 && gameState.combo % 5 === 0 && gameState.combo !== prevComboRef.current && !isMuted) {
      audioManager.playComboSound();
    }
    prevComboRef.current = gameState.combo;
  }, [gameState.combo, isMuted, audioManager]);

  const handleTargetClick = useCallback(() => {
    incrementScore();
    if (!isMuted) {
      audioManager.playHitSound();
    }
  }, [incrementScore, isMuted, audioManager]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioManager.setMuted(newMuted);
  }, [isMuted, audioManager]);

  return (
    <div className="app-container" data-testid="app-container">
      <h1 data-testid="app-title">🎯 Target Shooter</h1>
      
      {/* HUD Overlay for testing - outside canvas */}
      <div style={{ position: "absolute", top: "60px", left: "20px", zIndex: 10, display: "flex", gap: "20px" }}>
        <div data-testid="timer-display" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "10px 20px", borderRadius: "8px", backdropFilter: "blur(10px)" }}>
          <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>TIME</div>
          <div style={{ color: gameState.timeLeft <= 10 ? "#ff4444" : "#00ff88", fontSize: "24px", fontWeight: "bold" }}>{gameState.timeLeft}s</div>
        </div>
        
        <div data-testid="score-display" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "10px 20px", borderRadius: "8px", backdropFilter: "blur(10px)" }}>
          <div data-testid="score-label" style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>SCORE</div>
          <div data-testid="score-value" style={{ color: "#00ff88", fontSize: "24px", fontWeight: "bold" }}>{gameState.score}</div>
          {gameState.combo > 0 && <div style={{ color: "#ffa500", fontSize: "12px" }}>🔥 COMBO x{gameState.combo}</div>}
        </div>
        
        <div data-testid="level-display" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "10px 20px", borderRadius: "8px", backdropFilter: "blur(10px)" }}>
          <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>LEVEL</div>
          <div style={{ color: "#646cff", fontSize: "24px", fontWeight: "bold" }}>{gameState.level}</div>
          {gameState.highScore > 0 && <div style={{ color: "#ffa500", fontSize: "10px" }}>HIGH: {gameState.highScore}</div>}
        </div>
      </div>
      
      {/* Game Status and Controls */}
      <div style={{ position: "absolute", top: "60px", right: "20px", zIndex: 10, display: "flex", gap: "10px", alignItems: "center" }}>
        <div data-testid="game-status" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "8px 16px", borderRadius: "8px", backdropFilter: "blur(10px)", color: gameState.isPlaying && gameState.timeLeft > 0 ? "#00ff88" : "#ffa500", fontSize: "14px", fontWeight: "bold" }}>
          {gameState.timeLeft <= 0 ? "⏱️ Time's Up!" : gameState.isPlaying ? "🎯 Active" : "⏸️ Paused"}
        </div>
        <button
          onClick={togglePause}
          data-testid="pause-button"
          disabled={gameState.timeLeft <= 0}
          style={{
            background: gameState.timeLeft <= 0 ? "#666666" : gameState.isPlaying ? "#ff6b35" : "#00c851",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: gameState.timeLeft <= 0 ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {gameState.isPlaying ? "⏸️ Pause" : "▶️ Resume"}
        </button>
        <button
          onClick={resetGame}
          data-testid="reset-button"
          style={{
            background: "#7c3aed",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          🔄 Reset
        </button>
        <button
          onClick={handleMuteToggle}
          data-testid="mute-button"
          style={{
            background: isMuted ? "#666666" : "#10b981",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      </div>
      
      {/* Instructions */}
      <div data-testid="instructions-text" style={{ position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "rgba(33, 38, 45, 0.7)", padding: "12px 20px", borderRadius: "12px", backdropFilter: "blur(10px)", color: gameState.isPlaying && gameState.timeLeft > 0 ? "#ffffff" : "#7d8590", fontSize: "16px", textAlign: "center" }}>
        {gameState.timeLeft <= 0
          ? `🎮 Game Over! Final Score: ${gameState.score} - Click Reset to play again`
          : gameState.isPlaying
          ? "🎯 Click the target to score! Build combos for bonus points!"
          : "⏸️ Game paused - Resume to continue"}
      </div>
      
      {/* Pause overlay */}
      {!gameState.isPlaying && gameState.timeLeft > 0 && (
        <div data-testid="pause-overlay" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20, background: "rgba(0, 0, 0, 0.85)", padding: "40px 60px", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(20px)", border: "2px solid rgba(100, 108, 255, 0.5)" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>⏸️</div>
          <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold" }}>GAME PAUSED</div>
        </div>
      )}
      
      {/* Game Over overlay */}
      {gameState.timeLeft <= 0 && (
        <div data-testid="gameover-overlay" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20, background: "rgba(0, 0, 0, 0.85)", padding: "40px 60px", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(20px)", border: "2px solid rgba(255, 68, 68, 0.5)" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎮</div>
          <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>GAME OVER</div>
          <div style={{ color: "#00ff88", fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>{gameState.score}</div>
          <div style={{ color: "#7d8590", fontSize: "16px" }}>
            {gameState.isNewHighScore && gameState.score > 0
              ? "🏆 New High Score!"
              : `High Score: ${gameState.highScore}`}
          </div>
        </div>
      )}
      
      <div
        data-testid="threejs-canvas-container"
        style={{ width: "100%", height: "600px" }}
      >
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%)" }}
          data-testid="threejs-canvas"
          shadows
        >
          <GameScene 
            gameState={gameState}
            onTargetClick={handleTargetClick}
          />
        </Canvas>
      </div>
      <p className="instructions" data-testid="app-instructions">
        An immersive 3D target shooting game with combos, levels, and time pressure!
      </p>
    </div>
  );
}

export default App;
