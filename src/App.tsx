import { Application, extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { useCallback, useState } from "react";
import type { JSX } from "react";
import "./App.css";

// Extend @pixi/react with the Pixi components we want to use
extend({
  Container,
  Graphics,
  Text,
});

interface GameState {
  score: number;
  playerX: number;
  playerY: number;
}

function GameContent(): JSX.Element {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    playerX: 400,
    playerY: 300,
  });

  const drawPlayer = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: 0x646cff });
    graphics.circle(0, 0, 25);
    graphics.fill();
    graphics.setStrokeStyle({ color: 0xffffff, width: 2 });
    graphics.stroke();
  }, []);

  const drawBackground = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: 0x242424 });
    graphics.rect(0, 0, 800, 600);
    graphics.fill();
  }, []);

  const handlePlayerClick = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      playerX: Math.random() * 750 + 25,
      playerY: Math.random() * 550 + 25,
    }));
  }, []);

  return (
    <pixiContainer>
      {/* Background */}
      <pixiGraphics draw={drawBackground} />

      {/* Score display */}
      <pixiText
        text={`Score: ${gameState.score}`}
        x={20}
        y={20}
        style={{
          fontFamily: "Arial",
          fontSize: 24,
          fill: 0xffffff,
        }}
      />

      {/* Instructions */}
      <pixiText
        text="Click the circle to score points!"
        x={20}
        y={50}
        style={{
          fontFamily: "Arial",
          fontSize: 16,
          fill: 0xcccccc,
        }}
      />

      {/* Player circle */}
      <pixiContainer
        x={gameState.playerX}
        y={gameState.playerY}
        interactive={true}
        cursor="pointer"
        onClick={handlePlayerClick}
      >
        <pixiGraphics draw={drawPlayer} />
      </pixiContainer>
    </pixiContainer>
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
      >
        <GameContent />
      </Application>
      <p className="instructions">
        A minimal PixiJS game built with @pixi/react
      </p>
    </div>
  );
}

export default App;
