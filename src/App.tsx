import { Application, extend, useApplication } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { LayoutContainer } from "@pixi/layout/components";
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
});

interface GameState {
  score: number;
  playerX: number;
  playerY: number;
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
    playerX: 50, // Percentage-based positioning
    playerY: 50,
  });

  const gameAreaRef = useRef<LayoutContainer>(null);
  const { app } = useApplication();

  const drawPlayer = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: 0x646cff });
    graphics.circle(0, 0, 25);
    graphics.fill();
    graphics.setStrokeStyle({ color: 0xffffff, width: 2 });
    graphics.stroke();
  }, []);

  const handlePlayerClick = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      playerX: Math.random() * 80 + 10, // Keep within 10-90% range
      playerY: Math.random() * 70 + 15, // Keep within 15-85% range
    }));
  }, []);

  // Calculate player position based on app dimensions
  const gameAreaWidth = app.screen.width;
  const gameAreaHeight = app.screen.height * 0.85; // 85% for game area
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
        {/* UI Panel */}
        <layoutContainer
          layout={{
            width: "100%",
            height: "15%",
            backgroundColor: "#1a1a1a",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 20,
            paddingTop: 10,
            gap: 20,
          }}
        >
          {/* Score display */}
          <pixiText
            text={`Score: ${gameState.score}`}
            style={{
              fontFamily: "Arial",
              fontSize: 24,
              fill: 0xffffff,
            }}
          />

          {/* Instructions */}
          <pixiText
            text="Click the circle to score points!"
            style={{
              fontFamily: "Arial",
              fontSize: 16,
              fill: 0xcccccc,
            }}
          />
        </layoutContainer>

        {/* Game Area */}
        <layoutContainer
          ref={gameAreaRef}
          layout={{
            width: "100%",
            height: "85%",
            backgroundColor: "#242424",
          }}
        >
          {/* Player circle positioned with calculated coordinates */}
          <pixiContainer
            x={playerPixelX}
            y={playerPixelY}
            interactive={true}
            cursor="pointer"
            onClick={handlePlayerClick}
          >
            <pixiGraphics draw={drawPlayer} />
          </pixiContainer>
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
