import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Create a proper spy for the extend function
const extendSpy = vi.fn();

// Mock @pixi/react with proper React components
vi.mock("@pixi/react", () => ({
  Application: ({
    children,
    width,
    height,
    backgroundColor,
    antialias,
  }: {
    children?: React.ReactNode;
    width: number;
    height: number;
    backgroundColor: number;
    antialias: boolean;
  }) =>
    React.createElement(
      "div",
      {
        "data-testid": "pixi-application",
        "data-width": width,
        "data-height": height,
        "data-background-color": backgroundColor,
        "data-antialias": antialias,
      },
      children
    ),
  extend: extendSpy,
}));

// Mock PixiJS core components with complete exports using importOriginal
vi.mock("pixi.js", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Container: vi.fn().mockImplementation(() => ({})),
    Graphics: vi.fn().mockImplementation(() => ({
      clear: vi.fn(),
      setFillStyle: vi.fn(),
      circle: vi.fn(),
      rect: vi.fn(),
      fill: vi.fn(),
      setStrokeStyle: vi.fn(),
      stroke: vi.fn(),
    })),
    Text: vi.fn().mockImplementation(() => ({})),
    TextStyle: vi.fn().mockImplementation(() => ({})),
    Application: vi.fn().mockImplementation(() => ({})),
    Sprite: vi.fn().mockImplementation(() => ({})),
    Texture: {
      from: vi.fn(),
      EMPTY: {},
      WHITE: {},
    },
    Rectangle: vi.fn().mockImplementation(() => ({})),
    Point: vi.fn().mockImplementation(() => ({})),
  };
});

// Create properly typed React components for PixiJS intrinsic elements
const createPixiComponent = (displayName: string) => {
  const Component = ({
    children,
    draw,
    interactive,
    cursor,
    onClick,
    style,
    text,
    ...props
  }: {
    children?: React.ReactNode;
    draw?: (graphics: unknown) => void;
    interactive?: boolean;
    cursor?: string;
    onClick?: () => void;
    style?: Record<string, unknown>;
    text?: string;
    [key: string]: unknown;
  }): React.ReactElement => {
    // Convert problematic props to strings for DOM compatibility
    const domProps: Record<string, unknown> = {
      ...props,
      "data-testid": displayName.toLowerCase(),
      "data-has-draw": draw ? "true" : undefined,
      "data-interactive": interactive ? "true" : undefined,
      "data-cursor": cursor,
      "data-style": style ? JSON.stringify(style) : undefined,
      "data-text": text,
      // Handle click events properly
      onClick: onClick,
    };

    // Clean up undefined values
    Object.keys(domProps).forEach((key) => {
      if (domProps[key] === undefined) {
        delete domProps[key];
      }
    });

    return React.createElement("div", domProps, text || children);
  };
  Component.displayName = displayName;
  return Component;
};

// Define the PixiJS components as proper React components
const PixiContainer = createPixiComponent("pixi-container");
const PixiGraphics = createPixiComponent("pixi-graphics");
const PixiText = createPixiComponent("pixi-text");

// Store original createElement and create a safe override
const originalCreateElement = React.createElement;

// Create a type-safe createElement override
const createElementOverride = (
  type: string | React.ComponentType<unknown>,
  props: Record<string, unknown> | null,
  ...children: React.ReactNode[]
): React.ReactElement => {
  // Handle PixiJS intrinsic elements
  if (typeof type === "string") {
    switch (type) {
      case "pixiContainer":
        return originalCreateElement(PixiContainer, props, ...children);
      case "pixiGraphics":
        return originalCreateElement(PixiGraphics, props, ...children);
      case "pixiText":
        return originalCreateElement(PixiText, props, ...children);
      default:
        // For regular HTML elements, use the original createElement
        return originalCreateElement(type, props, ...children);
    }
  }

  return originalCreateElement(type, props, ...children);
};

// Override React.createElement safely
Object.defineProperty(React, "createElement", {
  value: createElementOverride,
  writable: true,
  configurable: true,
});

// Declare global JSX namespace for PixiJS intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pixiContainer: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      > & {
        x?: number;
        y?: number;
        interactive?: boolean;
        cursor?: string;
        onClick?: () => void;
        alpha?: number;
        visible?: boolean;
        rotation?: number;
        scale?: number | { x: number; y: number };
        pivot?: { x: number; y: number };
        anchor?: { x: number; y: number };
      };
      pixiGraphics: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      > & {
        draw?: (graphics: unknown) => void;
        x?: number;
        y?: number;
        alpha?: number;
        visible?: boolean;
        rotation?: number;
        scale?: number | { x: number; y: number };
        pivot?: { x: number; y: number };
      };
      pixiText: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      > & {
        text: string;
        x?: number;
        y?: number;
        style?: Record<string, unknown>;
        alpha?: number;
        visible?: boolean;
        rotation?: number;
        scale?: number | { x: number; y: number };
        pivot?: { x: number; y: number };
        anchor?: { x: number; y: number };
      };
    }
  }
}

// Create a properly typed ImageData mock
const createMockImageData = (
  width: number = 1,
  height: number = 1
): ImageData => {
  const data = new Uint8ClampedArray(width * height * 4);
  return {
    data,
    width,
    height,
    colorSpace: "srgb" as PredefinedColorSpace,
  } as ImageData;
};

// Mock canvas context with proper typing
HTMLCanvasElement.prototype.getContext = vi.fn(function (
  this: HTMLCanvasElement,
  contextId: string
):
  | CanvasRenderingContext2D
  | WebGLRenderingContext
  | ImageBitmapRenderingContext
  | null {
  const mockCreateImageData = vi
    .fn()
    .mockImplementation(
      (widthOrImageData: number | ImageData, height?: number): ImageData => {
        if (typeof widthOrImageData === "number") {
          const w = widthOrImageData;
          const h = height || 1;
          return createMockImageData(w, h);
        } else {
          const imageData = widthOrImageData as ImageData;
          return createMockImageData(imageData.width, imageData.height);
        }
      }
    );

  const mockContext2D: Partial<CanvasRenderingContext2D> = {
    canvas: this,
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => createMockImageData()),
    putImageData: vi.fn(),
    createImageData:
      mockCreateImageData as CanvasRenderingContext2D["createImageData"],
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 } as TextMetrics)),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    globalAlpha: 1,
    globalCompositeOperation: "source-over" as GlobalCompositeOperation,
    fillStyle: "#000000",
    strokeStyle: "#000000",
    lineWidth: 1,
    lineCap: "butt" as CanvasLineCap,
    lineJoin: "miter" as CanvasLineJoin,
    miterLimit: 10,
    getLineDash: vi.fn(() => []),
    setLineDash: vi.fn(),
    lineDashOffset: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: "transparent",
    font: "10px sans-serif",
    textAlign: "start" as CanvasTextAlign,
    textBaseline: "alphabetic" as CanvasTextBaseline,
    direction: "inherit" as CanvasDirection,
  };

  const mockContextWebGL: Partial<WebGLRenderingContext> = {
    canvas: this,
    getExtension: vi.fn(),
    createShader: vi.fn(),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    createProgram: vi.fn(),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    useProgram: vi.fn(),
    createBuffer: vi.fn(),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    drawArrays: vi.fn(),
    viewport: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    blendFunc: vi.fn(),
    drawingBufferWidth: 800,
    drawingBufferHeight: 600,
    drawingBufferColorSpace: "srgb" as PredefinedColorSpace,
  };

  const mockContextImageBitmap: Partial<ImageBitmapRenderingContext> = {
    canvas: this,
    transferFromImageBitmap: vi.fn(),
  };

  switch (contextId) {
    case "2d":
      return mockContext2D as CanvasRenderingContext2D;
    case "webgl":
    case "webgl2":
      return mockContextWebGL as WebGLRenderingContext;
    case "bitmaprenderer":
      return mockContextImageBitmap as ImageBitmapRenderingContext;
    default:
      return null;
  }
}) as HTMLCanvasElement["getContext"];

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Export the spy for use in tests
export { extendSpy };
