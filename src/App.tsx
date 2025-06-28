import { Application, extend, useApplication } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { LayoutContainer } from "@pixi/layout/components";
import { Button, FancyButton } from "@pixi/ui";
import "@pixi/layout/react";
import "@pixi/layout";
import { useCallback, useState, useRef } from "react";
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

  app.renderer.on("resize", () => {
    if (layoutRef.current) {
      layoutRef.current.layout = {
        width: app.screen.width,
        height: app.screen.height,
      };
    }
  });

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

  // Calculate player position based on app dimensions
  const gameAreaWidth = app.screen.width;
  const gameAreaHeight = app.screen.height * 0.85;
  const playerPixelX = (gameState.playerX / 100) * gameAreaWidth;
  const playerPixelY = (gameState.playerY / 100) * gameAreaHeight;

  return (
    <LayoutResizer>
      {/* Main game layout container with improved structure */}
      <layoutContainer
        layout={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header section with game title and stats */}
        <layoutContainer
          layout={{
            width: "100%",
            height: 80,
            backgroundColor: "#2d2d30",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          {/* Left section - Game title and status */}
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 4,
              flexShrink: 0,
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
              text={gameState.isPlaying ? "🎯 Active Game" : "⏸️ Game Paused"}
              style={{
                fontFamily: "Arial",
                fontSize: 12,
                fill: gameState.isPlaying ? 0x00ff88 : 0xffa500,
                fontWeight: "normal",
              }}
            />
          </layoutContainer>

          {/* Center section - Score display with enhanced styling */}
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#404045",
              borderRadius: 12,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 12,
              paddingBottom: 12,
              marginLeft: 20,
              marginRight: 20,
              flexGrow: 1,
              maxWidth: 200,
            }}
          >
            <pixiText
              text="SCORE"
              style={{
                fontFamily: "Arial",
                fontSize: 10,
                fill: 0xaaaaaa,
                fontWeight: "bold",
              }}
            />
            <pixiText
              text={gameState.score.toString()}
              style={{
                fontFamily: "Arial",
                fontSize: 32,
                fill: 0x00ff88,
                fontWeight: "bold",
              }}
            />
          </layoutContainer>

          {/* Right section - Control buttons */}
          <layoutContainer
            layout={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <pixiFancyButton
              defaultView={createButtonGraphics(
                gameState.isPlaying ? 0xff6b35 : 0x00c851,
                90,
                40,
                8
              )}
              hoverView={createButtonGraphics(
                gameState.isPlaying ? 0xff8a65 : 0x4caf50,
                90,
                40,
                8
              )}
              pressedView={createButtonGraphics(
                gameState.isPlaying ? 0xd84315 : 0x2e7d32,
                90,
                40,
                8
              )}
              text={gameState.isPlaying ? "Pause" : "Resume"}
              padding={8}
              onPress={handlePauseToggle}
            />

            <pixiFancyButton
              defaultView={createButtonGraphics(0x6200ea, 80, 40, 8)}
              hoverView={createButtonGraphics(0x7c4dff, 80, 40, 8)}
              pressedView={createButtonGraphics(0x3700b3, 80, 40, 8)}
              text="Reset"
              padding={8}
              onPress={handleReset}
            />
          </layoutContainer>
        </layoutContainer>

        {/* Instructions panel */}
        <layoutContainer
          layout={{
            width: "100%",
            height: 50,
            backgroundColor: "#363640",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <pixiText
            text={
              gameState.isPlaying
                ? "🎯 Click the glowing circle to score points!"
                : "🚫 Game is paused - Click Resume to continue"
            }
            style={{
              fontFamily: "Arial",
              fontSize: 16,
              fill: gameState.isPlaying ? 0xffffff : 0xcccccc,
              fontWeight: "normal",
            }}
          />
        </layoutContainer>

        {/* Game area with enhanced visual hierarchy */}
        <layoutContainer
          layout={{
            width: "100%",
            flexGrow: 1,
            backgroundColor: "#242428",
            borderRadius: 12,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          ref={gameAreaRef}
        >
          {/* Game background with improved grid */}
          <pixiGraphics
            draw={(g: Graphics) => {
              g.clear();
              // Main background
              g.setFillStyle({ color: 0x1e1e22 });
              g.roundRect(0, 0, gameAreaWidth - 32, gameAreaHeight - 32, 8);
              g.fill();

              // Subtle grid pattern
              g.setStrokeStyle({ color: 0x2a2a2e, width: 1, alpha: 0.5 });
              const gridSize = 60;
              const startX = 16;
              const startY = 16;
              const endX = gameAreaWidth - 16;
              const endY = gameAreaHeight - 16;

              for (let x = startX; x < endX; x += gridSize) {
                g.moveTo(x, startY);
                g.lineTo(x, endY - 32);
                g.stroke();
              }
              for (let y = startY; y < endY - 32; y += gridSize) {
                g.moveTo(startX, y);
                g.lineTo(endX - 32, y);
                g.stroke();
              }
            }}
          />

          {/* Player target with enhanced visual design */}
          <pixiContainer
            x={playerPixelX}
            y={playerPixelY}
            interactive={gameState.isPlaying}
            cursor={gameState.isPlaying ? "pointer" : "default"}
            onClick={handlePlayerClick}
            scale={gameState.isPlaying ? 1 : 0.7}
            alpha={gameState.isPlaying ? 1 : 0.4}
          >
            <pixiGraphics
              draw={(g: Graphics) => {
                g.clear();

                if (gameState.isPlaying) {
                  // Outer pulse ring
                  g.setFillStyle({ color: 0x00ff88, alpha: 0.2 });
                  g.circle(0, 0, 45);
                  g.fill();

                  // Middle glow
                  g.setFillStyle({ color: 0x00ff88, alpha: 0.4 });
                  g.circle(0, 0, 35);
                  g.fill();
                }

                // Main target circle
                g.setFillStyle({
                  color: gameState.isPlaying ? 0x00ff88 : 0x666666,
                });
                g.circle(0, 0, 28);
                g.fill();

                // Inner highlight
                g.setFillStyle({ color: 0xffffff, alpha: 0.3 });
                g.circle(-10, -10, 12);
                g.fill();

                // Border ring
                g.setStrokeStyle({
                  color: gameState.isPlaying ? 0xffffff : 0x999999,
                  width: 3,
                });
                g.circle(0, 0, 28);
                g.stroke();

                // Center dot
                g.setFillStyle({ color: 0xffffff, alpha: 0.8 });
                g.circle(0, 0, 4);
                g.fill();
              }}
            />
          </pixiContainer>

          {/* Game status overlay with better positioning */}
          {!gameState.isPlaying && (
            <layoutContainer
              layout={{
                position: "absolute",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: 12,
              }}
            >
              <layoutContainer
                layout={{
                  backgroundColor: "#2d2d30",
                  borderRadius: 16,
                  paddingLeft: 40,
                  paddingRight: 40,
                  paddingTop: 30,
                  paddingBottom: 30,
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <pixiText
                  text="⏸️"
                  style={{
                    fontFamily: "Arial",
                    fontSize: 48,
                    fill: 0xffa500,
                  }}
                />
                <pixiText
                  text="GAME PAUSED"
                  style={{
                    fontFamily: "Arial",
                    fontSize: 24,
                    fill: 0xffffff,
                    fontWeight: "bold",
                  }}
                />
                <pixiText
                  text="Click Resume to continue"
                  style={{
                    fontFamily: "Arial",
                    fontSize: 14,
                    fill: 0xcccccc,
                  }}
                />
              </layoutContainer>
            </layoutContainer>
          )}
        </layoutContainer>

        {/* Footer stats bar */}
        <layoutContainer
          layout={{
            width: "100%",
            height: 40,
            backgroundColor: "#2d2d30",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 6,
            marginTop: 8,
          }}
        >
          <pixiText
            text={`Clicks: ${gameState.score}`}
            style={{
              fontFamily: "Arial",
              fontSize: 12,
              fill: 0xaaaaaa,
            }}
          />
          <pixiText
            text="PixiJS Game Engine"
            style={{
              fontFamily: "Arial",
              fontSize: 12,
              fill: 0x666666,
            }}
          />
          <pixiText
            text={gameState.isPlaying ? "🟢 Online" : "🟡 Paused"}
            style={{
              fontFamily: "Arial",
              fontSize: 12,
              fill: gameState.isPlaying ? 0x00ff88 : 0xffa500,
            }}
          />
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
        width={800}
        height={600}
        backgroundColor={0x242424}
        antialias={true}
        resizeTo={window}
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
