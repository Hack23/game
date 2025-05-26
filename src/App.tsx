import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useState, useMemo } from "react";
import type { JSX } from "react";
import "./App.css";

// Extend @pixi/react with the Pixi components we want to use
extend({
  Container,
  Graphics,
});

// --- Rubik's Cube Definitions ---

const COLORS = {
  W: 0xffffff, // White (Up)
  Y: 0xffff00, // Yellow (Down)
  B: 0x0000ff, // Blue (Right)
  G: 0x00ff00, // Green (Front)
  O: 0xffa500, // Orange (Left)
  R: 0xff0000, // Red (Back)
} as const;

type ColorKey = keyof typeof COLORS;
type Facelet = ColorKey;
type Face = Facelet[][]; // 3x3 face

interface CubeState {
  U: Face; // Up (White)
  L: Face; // Left (Orange)
  F: Face; // Front (Green)
  R: Face; // Right (Blue)
  B: Face; // Back (Red)
  D: Face; // Down (Yellow)
}

const createInitialFace = (color: ColorKey): Face =>
  Array(3)
    .fill(null)
    .map(() => Array(3).fill(color));

const INITIAL_CUBE_STATE: CubeState = {
  U: createInitialFace("W"),
  L: createInitialFace("O"),
  F: createInitialFace("G"),
  R: createInitialFace("B"),
  B: createInitialFace("R"),
  D: createInitialFace("Y"),
};

const FACELET_SIZE = 28;
const FACELET_SPACING = 3;
const FACE_SIZE = 3 * FACELET_SIZE + 2 * FACELET_SPACING;
const BLOCK_WIDTH = FACE_SIZE + FACELET_SPACING * 3;

// --- Rotation Logic ---

// Rotates a 3x3 face matrix clockwise
const rotateFaceClockwise = (face: Face): Face => {
  const newFace: Face = [
    [face[2]![0]!, face[1]![0]!, face[0]![0]!],
    [face[2]![1]!, face[1]![1]!, face[0]![1]!],
    [face[2]![2]!, face[1]![2]!, face[0]![2]!],
  ];
  return newFace;
};

// --- Move Implementations ---

const applyFMove = (cube: CubeState): CubeState => {
  const newCube = JSON.parse(JSON.stringify(cube)) as CubeState;

  // Rotate Front face clockwise
  newCube.F = rotateFaceClockwise(cube.F);

  // Move adjacent edges: U->R, R->D, D->L, L->U
  const tempRow = [cube.U[2]![0]!, cube.U[2]![1]!, cube.U[2]![2]!];

  newCube.U[2]![0] = cube.L[2]![2]!;
  newCube.U[2]![1] = cube.L[1]![2]!;
  newCube.U[2]![2] = cube.L[0]![2]!;

  newCube.R[0]![0] = tempRow[0]!;
  newCube.R[1]![0] = tempRow[1]!;
  newCube.R[2]![0] = tempRow[2]!;

  newCube.D[0]![2] = cube.R[2]![0]!;
  newCube.D[0]![1] = cube.R[1]![0]!;
  newCube.D[0]![0] = cube.R[0]![0]!;

  newCube.L[0]![2] = cube.D[0]![0]!;
  newCube.L[1]![2] = cube.D[0]![1]!;
  newCube.L[2]![2] = cube.D[0]![2]!;

  return newCube;
};

const applyRMove = (cube: CubeState): CubeState => {
  const newCube = JSON.parse(JSON.stringify(cube)) as CubeState;

  // Rotate Right face clockwise
  newCube.R = rotateFaceClockwise(cube.R);

  // Move adjacent edges: U->B, B->D, D->F, F->U
  const tempCol = [cube.U[0]![2]!, cube.U[1]![2]!, cube.U[2]![2]!];

  newCube.U[0]![2] = cube.F[0]![2]!;
  newCube.U[1]![2] = cube.F[1]![2]!;
  newCube.U[2]![2] = cube.F[2]![2]!;

  newCube.B[0]![0] = tempCol[2]!;
  newCube.B[1]![0] = tempCol[1]!;
  newCube.B[2]![0] = tempCol[0]!;

  newCube.D[0]![2] = cube.B[2]![0]!;
  newCube.D[1]![2] = cube.B[1]![0]!;
  newCube.D[2]![2] = cube.B[0]![0]!;

  newCube.F[0]![2] = cube.D[0]![2]!;
  newCube.F[1]![2] = cube.D[1]![2]!;
  newCube.F[2]![2] = cube.D[2]![2]!;

  return newCube;
};

const applyUMove = (cube: CubeState): CubeState => {
  const newCube = JSON.parse(JSON.stringify(cube)) as CubeState;

  // Rotate Up face clockwise
  newCube.U = rotateFaceClockwise(cube.U);

  // Move adjacent edges: F->L, L->B, B->R, R->F
  const tempRow = [cube.F[0]![0]!, cube.F[0]![1]!, cube.F[0]![2]!];

  newCube.F[0]![0] = cube.R[0]![0]!;
  newCube.F[0]![1] = cube.R[0]![1]!;
  newCube.F[0]![2] = cube.R[0]![2]!;

  newCube.L[0]![0] = tempRow[0]!;
  newCube.L[0]![1] = tempRow[1]!;
  newCube.L[0]![2] = tempRow[2]!;

  newCube.B[0]![0] = cube.L[0]![0]!;
  newCube.B[0]![1] = cube.L[0]![1]!;
  newCube.B[0]![2] = cube.L[0]![2]!;

  newCube.R[0]![0] = cube.B[0]![0]!;
  newCube.R[0]![1] = cube.B[0]![1]!;
  newCube.R[0]![2] = cube.B[0]![2]!;

  return newCube;
};

// --- Game Content Component ---
interface GameContentProps {
  cubeState: CubeState;
}

function GameContent({ cubeState }: GameContentProps): JSX.Element {
  const drawFacelet = useCallback(
    (graphics: Graphics, colorKey: ColorKey, x: number, y: number): void => {
      graphics.clear();
      graphics.rect(x, y, FACELET_SIZE, FACELET_SIZE);
      graphics.fill({ color: COLORS[colorKey] });
      graphics.stroke({ width: 2, color: 0x333333 });
    },
    []
  );

  const faceLayout = useMemo(
    () => ({
      U: { x: BLOCK_WIDTH, y: 0 },
      L: { x: 0, y: BLOCK_WIDTH },
      F: { x: BLOCK_WIDTH, y: BLOCK_WIDTH },
      R: { x: 2 * BLOCK_WIDTH, y: BLOCK_WIDTH },
      B: { x: 3 * BLOCK_WIDTH, y: BLOCK_WIDTH },
      D: { x: BLOCK_WIDTH, y: 2 * BLOCK_WIDTH },
    }),
    []
  );

  return (
    <pixiContainer>
      {Object.entries(cubeState).map(([faceKey, faceData]) => {
        const layoutInfo = faceLayout[faceKey as keyof CubeState];
        if (!layoutInfo) return null;

        return (
          <pixiContainer key={faceKey} x={layoutInfo.x} y={layoutInfo.y}>
            {faceData.flatMap((row: Facelet[], rIdx: number) =>
              row.map((faceletColor: Facelet, cIdx: number) => (
                <pixiGraphics
                  key={`${faceKey}-${rIdx}-${cIdx}`}
                  draw={(g: Graphics) =>
                    drawFacelet(
                      g,
                      faceletColor,
                      cIdx * (FACELET_SIZE + FACELET_SPACING),
                      rIdx * (FACELET_SIZE + FACELET_SPACING)
                    )
                  }
                />
              ))
            )}
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
}

function App(): JSX.Element {
  const [cubeState, setCubeState] = useState<CubeState>(INITIAL_CUBE_STATE);

  const handleMove = useCallback(
    (moveFunction: (cube: CubeState) => CubeState): void => {
      setCubeState(moveFunction);
    },
    []
  );

  const handleShuffle = useCallback((): void => {
    const moves = [applyFMove, applyRMove, applyUMove];
    let newState = { ...cubeState };

    for (let i = 0; i < 10; i++) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)]!;
      newState = randomMove(newState);
    }

    setCubeState(newState);
  }, [cubeState]);

  const handleReset = useCallback(() => {
    setCubeState(INITIAL_CUBE_STATE);
  }, []);

  // Calculate canvas dimensions
  const canvasWidth = 4 * BLOCK_WIDTH + FACELET_SPACING * 2;
  const canvasHeight = 3 * BLOCK_WIDTH + FACELET_SPACING * 2;

  return (
    <div className="app-container">
      <h1>Rubik's Cube</h1>
      <Application
        width={canvasWidth}
        height={canvasHeight}
        backgroundColor={0x1a1a1a}
        antialias={true}
        data-testid="pixi-application"
      >
        <GameContent cubeState={cubeState} />
      </Application>
      <div className="controls">
        <div className="move-buttons">
          <button type="button" onClick={() => handleMove(applyFMove)}>
            F
          </button>
          <button type="button" onClick={() => handleMove(applyRMove)}>
            R
          </button>
          <button type="button" onClick={() => handleMove(applyUMove)}>
            U
          </button>
        </div>
        <div className="action-buttons">
          <button type="button" onClick={handleShuffle} className="shuffle-btn">
            Shuffle
          </button>
          <button type="button" onClick={handleReset} className="reset-btn">
            Reset
          </button>
        </div>
      </div>
      <div className="cube-legend">
        <div className="legend-item">
          <div
            className="color-box"
            style={{ backgroundColor: "#ffffff" }}
          ></div>
          <span>White (Up)</span>
        </div>
        <div className="legend-item">
          <div
            className="color-box"
            style={{ backgroundColor: "#ffff00" }}
          ></div>
          <span>Yellow (Down)</span>
        </div>
        <div className="legend-item">
          <div
            className="color-box"
            style={{ backgroundColor: "#00ff00" }}
          ></div>
          <span>Green (Front)</span>
        </div>
        <div className="legend-item">
          <div
            className="color-box"
            style={{ backgroundColor: "#0000ff" }}
          ></div>
          <span>Blue (Right)</span>
        </div>
        <div className="legend-item">
          <div
            className="color-box"
            style={{ backgroundColor: "#ffa500" }}
          ></div>
          <span>Orange (Left)</span>
        </div>
        <div className="legend-item">
          <div
            className="color-box"
            style={{ backgroundColor: "#ff0000" }}
          ></div>
          <span>Red (Back)</span>
        </div>
      </div>
      <p className="instructions">
        Standard Rubik's Cube with notation: F (Front), R (Right), U (Up). Use
        Shuffle to scramble and Reset to solve.
      </p>
    </div>
  );
}

export default App;
