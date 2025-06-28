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
      {/* Main game layout container */}
      <layoutContainer
        layout={{
          width: "100%",
          height: "100%",
          backgroundColor: "#242424",
          flexDirection: "column",
        }}
      >
        {/* UI Panel with improved styling */}
        <layoutContainer
          layout={{
            width: "100%",
            height: "15%",
            backgroundColor: "#1a1a1a",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {/* Left side - Score and instructions */}
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 5,
            }}
          >
            <pixiText
              text={`Score: ${gameState.score}`}
              style={{
                fontFamily: "Arial",
                fontSize: 28,
                fill: 0xffffff,
                fontWeight: "bold",
              }}
            />
            <pixiText
              text={
                gameState.isPlaying
                  ? "Click the circle to score!"
                  : "Game Paused"
              }
              style={{
                fontFamily: "Arial",
                fontSize: 14,
                fill: gameState.isPlaying ? 0x00ff00 : 0xff9900,
              }}
            />
          </layoutContainer>

          {/* Right side - Control buttons using @pixi/ui */}
          <layoutContainer
            layout={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
            }}
          >
            {/* Pause/Resume Button using FancyButton */}
            <pixiFancyButton
              defaultView={createButtonGraphics(
                gameState.isPlaying ? 0xff9900 : 0x00ff00,
                80,
                35,
                6
              )}
              hoverView={createButtonGraphics(
                gameState.isPlaying ? 0xffaa33 : 0x33ff33,
                80,
                35,
                6
              )}
              pressedView={createButtonGraphics(
                gameState.isPlaying ? 0xe68a00 : 0x00cc00,
                80,
                35,
                6
              )}
              text={gameState.isPlaying ? "Pause" : "Resume"}
              padding={12}
              onPress={handlePauseToggle}
            />

            {/* Reset Button using FancyButton */}
            <pixiFancyButton
              defaultView={createButtonGraphics(0x4caf50, 100, 40, 8)}
              hoverView={createButtonGraphics(0x66bb6a, 100, 40, 8)}
              pressedView={createButtonGraphics(0x388e3c, 100, 40, 8)}
              text="Reset"
              padding={12}
              onPress={handleReset}
            />
          </layoutContainer>
        </layoutContainer>

        {/* Game Area with enhanced styling */}
        <layoutContainer
          ref={gameAreaRef}
          layout={{
            width: "100%",
            height: "85%",
            backgroundColor: "#2a2a2a",
          }}
        >
          {/* Game background pattern */}
          <pixiGraphics
            draw={(g: Graphics) => {
              g.clear();
              // Draw subtle grid pattern
              g.setStrokeStyle({ color: 0x333333, width: 1, alpha: 0.3 });
              const gridSize = 50;
              for (let x = 0; x < gameAreaWidth; x += gridSize) {
                g.moveTo(x, 0);
                g.lineTo(x, gameAreaHeight);
                g.stroke();
              }
              for (let y = 0; y < gameAreaHeight; y += gridSize) {
                g.moveTo(0, y);
                g.lineTo(gameAreaWidth, y);
                g.stroke();
              }
            }}
          />

          {/* Player circle with enhanced visual feedback */}
          <pixiContainer
            x={playerPixelX}
            y={playerPixelY}
            interactive={gameState.isPlaying}
            cursor={gameState.isPlaying ? "pointer" : "default"}
            onClick={handlePlayerClick}
            scale={gameState.isPlaying ? 1 : 0.8}
            alpha={gameState.isPlaying ? 1 : 0.6}
          >
            <pixiGraphics
              draw={(g: Graphics) => {
                g.clear();
                // Outer glow effect
                g.setFillStyle({ color: 0x646cff, alpha: 0.3 });
                g.circle(0, 0, 35);
                g.fill();
                // Main circle
                g.setFillStyle({ color: 0x646cff });
                g.circle(0, 0, 25);
                g.fill();
                // Border
                g.setStrokeStyle({ color: 0xffffff, width: 2 });
                g.stroke();
                // Inner highlight
                g.setFillStyle({ color: 0xffffff, alpha: 0.3 });
                g.circle(-8, -8, 8);
                g.fill();
              }}
            />
          </pixiContainer>

          {/* Game status overlay when paused */}
          {!gameState.isPlaying && (
            <layoutContainer
              layout={{
                position: "absolute",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <pixiText
                text="GAME PAUSED"
                style={{
                  fontFamily: "Arial",
                  fontSize: 48,
                  fill: 0xffffff,
                  fontWeight: "bold",
                }}
              />
            </layoutContainer>
          )}
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
