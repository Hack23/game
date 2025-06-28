import {
  Application,
  ApplicationRef,
  extend,
  useApplication,
} from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { LayoutContainer } from "@pixi/layout/components";
import { Button, FancyButton } from "@pixi/ui";
import "@pixi/layout/react";
import "@pixi/layout";
import { useCallback, useState, useRef, useEffect } from "react";
import type { JSX } from "react";
import "./App.css";

// Extend @pixi/react with the Pixi components we want to use
extend({
  Container,
  Graphics,
  Text,
  LayoutContainer,
  Button,
  FancyButton,
});

interface GameState {
  score: number;
  playerX: number;
  playerY: number;
  isPlaying: boolean;
}

interface LayoutResizerProps {
  children: React.ReactNode;
}

// Add this interface to track screen dimensions
interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
}

function LayoutResizer({ children }: LayoutResizerProps): JSX.Element {
  const layoutRef = useRef<LayoutContainer>(null);
  const { app } = useApplication();
  const [dimensions, setDimensions] = useState<ScreenDimensions>({
    width: window.innerWidth,
    height: window.innerHeight - 100, // Account for header/footer
    scale: 1,
  });

  useEffect(() => {
    const calculateDimensions = (): ScreenDimensions => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight - 100; // Account for header/footer

      // Minimum content dimensions (adjust as needed for your game)
      const minWidth = 800;
      const minHeight = 600;

      // Calculate scale factors
      const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
      const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
      const scale = Math.max(scaleX, scaleY);

      return {
        width: windowWidth,
        height: windowHeight,
        scale: scale,
      };
    };

    const handleResize = (): void => {
      const newDimensions = calculateDimensions();
      setDimensions(newDimensions);

      if (layoutRef.current) {
        layoutRef.current.layout = {
          width: newDimensions.width,
          height: newDimensions.height,
        };
      }

      // Scroll to top to avoid mobile resize issues
      window.scrollTo(0, 0);
    };

    // Initial resize
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Also listen for PixiJS resize events if available
    if (app?.renderer && typeof app.renderer.on === "function") {
      app.renderer.on("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (app?.renderer && typeof app.renderer.off === "function") {
        app.renderer.off("resize", handleResize);
      }
    };
  }, [app]);

  return (
    <pixiContainer
      ref={layoutRef}
      layout={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      {children}
    </pixiContainer>
  );
}

// Add a custom hook to manage game state for better testability
function useGameState(initialState?: Partial<GameState>) {
  const [gameState, setGameState] = useState<GameState>({
    score: initialState?.score || 0,
    playerX: initialState?.playerX || 50,
    playerY: initialState?.playerY || 50,
    isPlaying: initialState?.isPlaying ?? true,
  });

  const incrementScore = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      playerX: Math.random() * 80 + 10,
      playerY: Math.random() * 70 + 15,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      playerX: 50,
      playerY: 50,
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

function GameContent(): JSX.Element {
  const { gameState, incrementScore, resetGame, togglePause } = useGameState();
  const gameAreaRef = useRef<LayoutContainer>(null);
  const { app } = useApplication();

  const handlePlayerClick = useCallback(() => {
    if (!gameState.isPlaying) return;
    incrementScore();
  }, [gameState.isPlaying, incrementScore]);

  const createButtonGraphics = useCallback(
    (
      color: number,
      width: number,
      height: number,
      cornerRadius: number = 6
    ): Graphics => {
      const graphics = new Graphics();

      // Try the PixiJS v8 approach first
      if (
        typeof graphics.setFillStyle === "function" &&
        typeof graphics.roundRect === "function"
      ) {
        graphics.setFillStyle({ color });
        graphics.roundRect(0, 0, width, height, cornerRadius);
        graphics.fill();
      }
      // Fall back to older PixiJS API style that might be used in tests
      else if (
        typeof graphics.beginFill === "function" &&
        typeof graphics.drawRoundedRect === "function"
      ) {
        graphics.beginFill(color);
        graphics.drawRoundedRect(0, 0, width, height, cornerRadius);
        graphics.endFill();
      }
      // Last resort - draw a regular rectangle if rounded corners not available
      else if (typeof graphics.beginFill === "function") {
        graphics.beginFill(color);
        if (typeof graphics.drawRect === "function") {
          graphics.drawRect(0, 0, width, height);
        }
        if (typeof graphics.endFill === "function") {
          graphics.endFill();
        }
      }

      return graphics;
    },
    []
  );

  // Check if app is initialized
  const isAppReady = Boolean(app && app.renderer);

  // Use safe default values when app isn't ready
  const screenWidth = isAppReady && app?.screen ? app.screen.width : 800;

  // If app is not ready, show loading state
  if (!isAppReady) {
    return (
      <pixiContainer data-testid="loading-container">
        <pixiText
          text="Loading..."
          style={{
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xffffff,
          }}
          x={400}
          y={300}
          anchor={0.5}
          data-testid="loading-text"
        />
      </pixiContainer>
    );
  }

  // Safe access to app dimensions with fallback values
  const gameAreaWidth = screenWidth;

  return (
    <LayoutResizer>
      {/* Main game layout container with card-style design */}
      <layoutContainer
        layout={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0d1117",
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
        data-testid="game-layout-container"
      >
        {/* Game card container */}
        <layoutContainer
          layout={{
            width: "100%", // Use full width
            height: "100%", // Use full height
            backgroundColor: "#161b22",
            borderRadius: 16,
            flexDirection: "column",
            overflow: "hidden",
          }}
          data-testid="game-card"
        >
          {/* Header section - Game title and status */}
          <layoutContainer
            layout={{
              width: "100%",
              height: 80,
              backgroundColor: "#21262d",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 24,
              paddingRight: 24,
            }}
            data-testid="game-header"
          >
            {/* Game title */}
            <layoutContainer
              layout={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
              }}
              data-testid="game-title-container"
            >
              <pixiText
                text="Circle Clicker"
                style={{
                  fontFamily: "Arial",
                  fontSize: 24,
                  fill: 0xffffff,
                  fontWeight: "bold",
                }}
                data-testid="game-title"
                data-text="Circle Clicker"
              />
              <pixiText
                text={gameState.isPlaying ? "🎯 Active" : "⏸️ Paused"}
                style={{
                  fontFamily: "Arial",
                  fontSize: 12,
                  fill: gameState.isPlaying ? 0x00ff88 : 0xffa500,
                }}
                data-testid="game-status"
                data-text={gameState.isPlaying ? "🎯 Active" : "⏸️ Paused"}
              />
            </layoutContainer>

            {/* Pause/Resume button in header */}
            <pixiFancyButton
              defaultView={createButtonGraphics(
                gameState.isPlaying ? 0xff6b35 : 0x00c851,
                100,
                40,
                8
              )}
              hoverView={createButtonGraphics(
                gameState.isPlaying ? 0xff8a65 : 0x4caf50,
                100,
                40,
                8
              )}
              pressedView={createButtonGraphics(
                gameState.isPlaying ? 0xd84315 : 0x2e7d32,
                100,
                40,
                8
              )}
              text={gameState.isPlaying ? "Pause" : "Resume"}
              padding={8}
              onPress={togglePause}
              data-testid="pause-button"
              aria-label={gameState.isPlaying ? "Pause Game" : "Resume Game"}
            />
          </layoutContainer>

          {/* Main content area */}
          <layoutContainer
            layout={{
              width: "100%",
              flexGrow: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              padding: 24,
            }}
            ref={gameAreaRef}
            data-testid="game-content"
          >
            {/* Centered score display */}
            <layoutContainer
              layout={{
                width: 240,
                backgroundColor: "#30363d",
                borderRadius: 20,
                paddingLeft: 32,
                paddingRight: 32,
                paddingTop: 20,
                paddingBottom: 20,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 20,
              }}
              data-testid="score-display"
              data-score={gameState.score.toString()}
            >
              <pixiText
                text="SCORE"
                style={{
                  fontFamily: "Arial",
                  fontSize: 14,
                  fill: 0x7d8590,
                  fontWeight: "bold",
                }}
                data-testid="score-label"
                data-text="SCORE"
              />
              <pixiText
                text={gameState.score.toString()}
                style={{
                  fontFamily: "Arial",
                  fontSize: 48,
                  fill: 0x00ff88,
                  fontWeight: "bold",
                }}
                data-testid="score-value"
                data-text={gameState.score.toString()}
                data-score={gameState.score.toString()}
              />
            </layoutContainer>

            {/* Instructions */}
            <layoutContainer
              layout={{
                width: 360,
                backgroundColor: "#21262d",
                borderRadius: 12,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 12,
                paddingBottom: 12,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 30,
              }}
              data-testid="instructions"
            >
              <pixiText
                text={
                  gameState.isPlaying
                    ? "🎯 Click the target to score points!"
                    : "⏸️ Game paused - Resume to continue"
                }
                style={{
                  fontFamily: "Arial",
                  fontSize: 16,
                  fill: gameState.isPlaying ? 0xffffff : 0x7d8590,
                  fontWeight: "normal",
                }}
                data-testid="instructions-text"
                data-text={
                  gameState.isPlaying
                    ? "🎯 Click the target to score points!"
                    : "⏸️ Game paused - Resume to continue"
                }
              />
            </layoutContainer>

            {/* Game area background */}
            <layoutContainer
              layout={{
                width: "100%",
                flexGrow: 1,
                backgroundColor: "#0d1117",
                borderRadius: 12,
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
              data-testid="game-play-area"
            >
              {/* Grid pattern background */}
              <pixiGraphics
                draw={(g: Graphics) => {
                  g.clear();
                  const areaWidth = Math.max(gameAreaWidth * 0.7, 400);
                  const areaHeight = Math.max(200, 300);

                  // Background with subtle pattern
                  g.setFillStyle({ color: 0x161b22 });
                  g.roundRect(0, 0, areaWidth, areaHeight, 8);
                  g.fill();

                  // Grid pattern
                  g.setStrokeStyle({ color: 0x21262d, width: 1, alpha: 0.6 });
                  const gridSize = 40;

                  for (let x = 0; x < areaWidth; x += gridSize) {
                    g.moveTo(x, 0);
                    g.lineTo(x, areaHeight);
                    g.stroke();
                  }
                  for (let y = 0; y < areaHeight; y += gridSize) {
                    g.moveTo(0, y);
                    g.lineTo(areaWidth, y);
                    g.stroke();
                  }
                }}
                data-testid="game-area-background"
              />

              {/* Enhanced target circle */}
              <pixiContainer
                x={
                  (gameState.playerX / 100) * Math.max(gameAreaWidth * 0.5, 300)
                }
                y={(gameState.playerY / 100) * Math.max(200, 200)}
                interactive={gameState.isPlaying}
                cursor={gameState.isPlaying ? "pointer" : "default"}
                onClick={handlePlayerClick}
                data-testid="target-circle"
                aria-label="Clickable target"
                scale={gameState.isPlaying ? 1 : 0.6}
                alpha={gameState.isPlaying ? 1 : 0.3}
                data-x={(
                  (gameState.playerX / 100) *
                  Math.max(gameAreaWidth * 0.5, 300)
                ).toString()}
                data-y={(
                  (gameState.playerY / 100) *
                  Math.max(200, 200)
                ).toString()}
                pixi-data={{ type: "target" }} // <-- Add this prop
              >
                <pixiGraphics
                  draw={(g: Graphics) => {
                    g.clear();

                    if (gameState.isPlaying) {
                      // Animated pulse rings
                      g.setFillStyle({ color: 0x00ff88, alpha: 0.1 });
                      g.circle(0, 0, 60);
                      g.fill();

                      g.setFillStyle({ color: 0x00ff88, alpha: 0.2 });
                      g.circle(0, 0, 45);
                      g.fill();

                      g.setFillStyle({ color: 0x00ff88, alpha: 0.3 });
                      g.circle(0, 0, 35);
                      g.fill();
                    }

                    // Main target circle
                    g.setFillStyle({
                      color: gameState.isPlaying ? 0x00ff88 : 0x30363d,
                    });
                    g.circle(0, 0, 30);
                    g.fill();

                    // Inner rings for target effect
                    g.setStrokeStyle({
                      color: gameState.isPlaying ? 0xffffff : 0x7d8590,
                      width: 2,
                    });
                    g.circle(0, 0, 25);
                    g.stroke();
                    g.circle(0, 0, 15);
                    g.stroke();
                    g.circle(0, 0, 5);
                    g.stroke();

                    // Center dot
                    g.setFillStyle({
                      color: gameState.isPlaying ? 0xffffff : 0x7d8590,
                    });
                    g.circle(0, 0, 3);
                    g.fill();
                  }}
                  data-testid="target-circle-graphics"
                />
              </pixiContainer>

              {/* Pause overlay with better design */}
              {!gameState.isPlaying && (
                <layoutContainer
                  layout={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderRadius: 12,
                  }}
                  data-testid="pause-overlay"
                >
                  <layoutContainer
                    layout={{
                      backgroundColor: "#21262d",
                      borderRadius: 20,
                      paddingLeft: 48,
                      paddingRight: 48,
                      paddingTop: 32,
                      paddingBottom: 32,
                      alignItems: "center",
                      gap: 12,
                    }}
                    data-testid="pause-modal"
                  >
                    <pixiText
                      text="⏸️"
                      style={{
                        fontFamily: "Arial",
                        fontSize: 64,
                        fill: 0xffa500,
                      }}
                      data-testid="pause-icon"
                    />
                    <pixiText
                      text="GAME PAUSED"
                      style={{
                        fontFamily: "Arial",
                        fontSize: 28,
                        fill: 0xffffff,
                        fontWeight: "bold",
                      }}
                      data-testid="pause-title"
                    />
                  </layoutContainer>
                </layoutContainer>
              )}
            </layoutContainer>
          </layoutContainer>

          {/* Bottom section - Reset button centered */}
          <layoutContainer
            layout={{
              width: "100%",
              height: 80,
              backgroundColor: "#21262d",
              justifyContent: "center",
              alignItems: "center",
            }}
            data-testid="game-footer"
          >
            <pixiFancyButton
              defaultView={createButtonGraphics(0x7c3aed, 140, 50, 12)}
              hoverView={createButtonGraphics(0x8b5cf6, 140, 50, 12)}
              pressedView={createButtonGraphics(0x6d28d9, 140, 50, 12)}
              text="🔄 Reset Game"
              padding={12}
              onPress={resetGame}
              data-testid="reset-button"
              aria-label="Reset Game"
            />
          </layoutContainer>

          {/* Footer stats */}
          <layoutContainer
            layout={{
              width: "100%",
              height: 40,
              backgroundColor: "#0d1117",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 20,
              paddingRight: 20,
            }}
            data-testid="game-stats"
          >
            <pixiText
              text={`Total Clicks: ${gameState.score}`}
              style={{
                fontFamily: "Arial",
                fontSize: 12,
                fill: 0x7d8590,
              }}
              data-testid="total-clicks"
              data-text={`Total Clicks: ${gameState.score}`}
            />
            <pixiText
              text="Built with PixiJS + Layout"
              style={{
                fontFamily: "Arial",
                fontSize: 12,
                fill: 0x58a6ff,
              }}
              data-testid="footer-built-with"
              data-text="Built with PixiJS + Layout"
            />
            <pixiText
              text={gameState.isPlaying ? "🟢 Active" : "🟡 Paused"}
              style={{
                fontFamily: "Arial",
                fontSize: 12,
                fill: gameState.isPlaying ? 0x00ff88 : 0xffa500,
              }}
              data-testid="footer-status"
              data-text={gameState.isPlaying ? "🟢 Active" : "🟡 Paused"}
            />
          </layoutContainer>
        </layoutContainer>
      </layoutContainer>
    </LayoutResizer>
  );
}

// Update the App component for proper sizing
function App(): JSX.Element {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 100,
  });

  // Use a ref to store the PixiJS Application instance
  const appRef = useRef<ApplicationRef>(null);

  // Set window.pixiApp as soon as the Application instance is available (for Cypress E2E)
  useEffect(() => {
    // Poll for the Application instance and set window.pixiApp as soon as possible
    const interval = setInterval(() => {
      const instance = appRef.current as { app?: unknown } | null;
      if (
        typeof window !== "undefined" &&
        (window as { Cypress?: boolean }).Cypress &&
        instance &&
        instance.app &&
        !(window as any).pixiApp
      ) {
        (window as any).pixiApp = instance.app;
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 100,
      });
      window.scrollTo(0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app-container" data-testid="app-container">
      <h1 data-testid="app-title">PixiJS React Game</h1>
      <div data-testid="pixi-application">
        <Application
          ref={appRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor={0x242424}
          antialias={true}
          resizeTo={window}
          autoDensity={true}
          resolution={window.devicePixelRatio || 1}
          powerPreference="high-performance"
        >
          <GameContent />
        </Application>
      </div>
      <p className="instructions" data-testid="app-instructions">
        A minimal PixiJS game built with @pixi/react and @pixi/layout
      </p>
    </div>
  );
}

export default App;
