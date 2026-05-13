import { Canvas } from "@react-three/fiber";
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import type { JSX } from "react";
import { useGameState } from "./hooks/useGameState";
import { useAudioManager } from "./hooks/useAudioManager";
import {
  PARTICLE_EXPLOSION_DURATION_MS,
  GameScene,
  HUD,
  GameControls,
  GameInstructions,
  PauseOverlay,
  GameOverOverlay,
} from "./components";
import "./App.css";

/**
 * Root application component that orchestrates the game loop,
 * audio integration, and UI overlays.
 *
 * Architecture: App manages high-level game state and delegates
 * 3D rendering to GameScene, HUD display to HUD, and overlays
 * to dedicated overlay components.
 */
function App(): JSX.Element {
  const { gameState, incrementScore, recordMiss, resetGame, togglePause } = useGameState();
  const audioManager = useAudioManager();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState<[number, number, number]>([0, 0, 0]);
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

  const handleTargetClick = useCallback((targetId: number) => {
    // Find the target position for explosion effect
    const target = gameState.targets.find(t => t.id === targetId);
    if (target) {
      setExplosionPosition([target.x, target.y, target.z]);
      setShowExplosion(true);
      setTimeout(() => setShowExplosion(false), PARTICLE_EXPLOSION_DURATION_MS);
    }
    
    incrementScore(targetId);
    if (!isMuted) {
      audioManager.playHitSound();
    }
  }, [incrementScore, isMuted, audioManager, gameState.targets]);

  const handleMiss = useCallback(() => {
    recordMiss();
    // Optional: play a miss sound or provide visual feedback
  }, [recordMiss]);

  // Expose test API for E2E tests to trigger target clicks.
  // This bypasses Three.js raycasting which doesn't work reliably in headless CI.
  // Use refs so the listener is registered once and reads latest state/handler.
  const handleTargetClickRef = useRef(handleTargetClick);
  handleTargetClickRef.current = handleTargetClick;
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // useLayoutEffect (not useEffect) ensures the listener is registered synchronously
  // before the browser paints, preventing a race where Cypress finds the target-sphere
  // in the DOM before the test event listener is ready to receive events.
  useLayoutEffect(() => {
    const handleTestTargetClick = (): void => {
      const gs = gameStateRef.current;
      if (gs.isPlaying && gs.timeLeft > 0 && gs.targets.length > 0) {
        handleTargetClickRef.current(gs.targets[0]?.id ?? 0);
      }
    };

    window.addEventListener("test:targetClick", handleTestTargetClick);
    return (): void => window.removeEventListener("test:targetClick", handleTestTargetClick);
  }, []);

  const handleMuteToggle = useCallback((): void => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioManager.setMuted(newMuted);
  }, [isMuted, audioManager]);

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>): void => {
      const newVolume = parseFloat((event.target as HTMLInputElement).value);
      setVolume(newVolume);
      audioManager.setVolume(newVolume);
    },
    [audioManager],
  );

  return (
    <div className="app-container" data-testid="app-container">
      <h1 data-testid="app-title">🎯 Target Shooter</h1>

      {/* HUD Overlay */}
      <HUD gameState={gameState} />

      {/* Game Controls */}
      <GameControls
        gameState={gameState}
        isMuted={isMuted}
        volume={volume}
        onTogglePause={togglePause}
        onReset={resetGame}
        onMuteToggle={handleMuteToggle}
        onVolumeChange={handleVolumeChange}
      />

      {/* Instructions */}
      <GameInstructions gameState={gameState} />

      {/* Audio status note */}
      {!isMuted && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            background: "rgba(33, 38, 45, 0.5)",
            padding: "6px 12px",
            borderRadius: "8px",
            color: "#00ff88",
            fontSize: "12px",
          }}
        >
          🔊 Sound enabled - Click target to hear effects
        </div>
      )}

      {/* Pause overlay */}
      <PauseOverlay visible={!gameState.isPlaying && gameState.timeLeft > 0} />

      {/* Game Over overlay */}
      <GameOverOverlay
        visible={gameState.timeLeft <= 0}
        score={gameState.score}
        isNewHighScore={gameState.isNewHighScore}
        highScore={gameState.highScore}
      />

      <div
        data-testid="threejs-canvas-container"
        style={{ width: "100%", height: "600px", position: "relative" }}
      >
        {/* Hidden DOM element for Cypress testing - indicates target sphere exists */}
        {gameState.isPlaying && gameState.timeLeft > 0 && (
          <div
            data-testid="target-sphere"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
        )}
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%)" }}
          data-testid="threejs-canvas"
          shadows
        >
          <GameScene
            gameState={gameState}
            onTargetClick={handleTargetClick}
            onMiss={handleMiss}
            showExplosion={showExplosion}
            explosionPosition={explosionPosition}
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
