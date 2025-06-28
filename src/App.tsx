import { Application, extend, useApplication } from "@pixi/react";
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

function LayoutResizer({ children }: LayoutResizerProps): JSX.Element {
  const layoutRef = useRef<LayoutContainer>(null);
  const { app } = useApplication();

  useEffect(() => {
    const handleResize = (): void => {
      if (layoutRef.current && app?.screen) {
        layoutRef.current.layout = {
          width: app.screen.width,
          height: app.screen.height,
        };
      }
    };

    if (app?.renderer) {
      app.renderer.on("resize", handleResize);
      return () => {
        app.renderer.off("resize", handleResize);
      };
    }
  }, [app]);

  return (
    <pixiContainer ref={layoutRef} layout={{}}>
      {children}
    </pixiContainer>
  );
}

function GameContent(): JSX.Element {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    playerX: 50,
    playerY: 50,
    isPlaying: true,
  });

  const gameAreaRef = useRef<LayoutContainer>(null);
  const { app } = useApplication();

  const handlePlayerClick = useCallback(() => {
    if (!gameState.isPlaying) return;

    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      playerX: Math.random() * 80 + 10,
      playerY: Math.random() * 70 + 15,
    }));
  }, [gameState.isPlaying]);

  const handleReset = useCallback(() => {
    setGameState({
      score: 0,
      playerX: 50,
      playerY: 50,
      isPlaying: true,
    });
  }, []);

  const handlePauseToggle = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const createButtonGraphics = useCallback(
    (
      color: number,
      width: number,
      height: number,
      cornerRadius: number = 6
    ): Graphics => {
      const graphics = new Graphics();
      graphics.setFillStyle({ color });
      graphics.roundRect(0, 0, width, height, cornerRadius);
      graphics.fill();
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
      <pixiContainer>
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
          >
            {/* Game title */}
            <layoutContainer
              layout={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
              }}
            >
              <pixiText
                text="Circle Clicker"
                style={{
                  fontFamily: "Arial",
                  fontSize: 24,
                  fill: 0xffffff,
                  fontWeight: "bold",
                }}
              />
              <pixiText
                text={gameState.isPlaying ? "🎯 Active" : "⏸️ Paused"}
                style={{
                  fontFamily: "Arial",
                  fontSize: 12,
                  fill: gameState.isPlaying ? 0x00ff88 : 0xffa500,
                }}
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
              onPress={handlePauseToggle}
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
            >
              <pixiText
                text="SCORE"
                style={{
                  fontFamily: "Arial",
                  fontSize: 14,
                  fill: 0x7d8590,
                  fontWeight: "bold",
                }}
              />
              <pixiText
                text={gameState.score.toString()}
                style={{
                  fontFamily: "Arial",
                  fontSize: 48,
                  fill: 0x00ff88,
                  fontWeight: "bold",
                }}
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
                scale={gameState.isPlaying ? 1 : 0.6}
                alpha={gameState.isPlaying ? 1 : 0.3}
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
                  >
                    <pixiText
                      text="⏸️"
                      style={{
                        fontFamily: "Arial",
                        fontSize: 64,
                        fill: 0xffa500,
                      }}
                    />
                    <pixiText
                      text="GAME PAUSED"
                      style={{
                        fontFamily: "Arial",
                        fontSize: 28,
                        fill: 0xffffff,
                        fontWeight: "bold",
                      }}
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
          >
            <pixiFancyButton
              defaultView={createButtonGraphics(0x7c3aed, 140, 50, 12)}
              hoverView={createButtonGraphics(0x8b5cf6, 140, 50, 12)}
              pressedView={createButtonGraphics(0x6d28d9, 140, 50, 12)}
              text="🔄 Reset Game"
              padding={12}
              onPress={handleReset}
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
          >
            <pixiText
              text={`Total Clicks: ${gameState.score}`}
              style={{
                fontFamily: "Arial",
                fontSize: 12,
                fill: 0x7d8590,
              }}
            />
            <pixiText
              text="Built with PixiJS + Layout"
              style={{
                fontFamily: "Arial",
                fontSize: 12,
                fill: 0x58a6ff,
              }}
            />
            <pixiText
              text={gameState.isPlaying ? "🟢 Active" : "🟡 Paused"}
              style={{
                fontFamily: "Arial",
                fontSize: 12,
                fill: gameState.isPlaying ? 0x00ff88 : 0xffa500,
              }}
            />
          </layoutContainer>
        </layoutContainer>
      </layoutContainer>
    </LayoutResizer>
  );
}

function App(): JSX.Element {
  return (
    <div className="app-container">
      <h1>PixiJS React Game</h1>
      <Application
        width={window.innerWidth}
        height={window.innerHeight - 100} // Account for header/footer
        backgroundColor={0x242424}
        antialias={true}
        resizeTo={window} // This ensures automatic resizing
        autoDensity={true}
        resolution={window.devicePixelRatio || 1}
        powerPreference="high-performance"
      >
        <GameContent />
      </Application>
      <p className="instructions">
        A minimal PixiJS game built with @pixi/react and @pixi/layout
      </p>
    </div>
  );
}

export default App;
