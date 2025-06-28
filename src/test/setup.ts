import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock for Graphics class
class MockGraphics {
  beginFill(_color: number): this {
    return this;
  }

  drawRoundedRect(
    _x: number,
    _y: number,
    _width: number,
    _height: number,
    _radius: number
  ): this {
    return this;
  }

  drawRect(_x: number, _y: number, _width: number, _height: number): this {
    return this;
  }

  endFill(): this {
    return this;
  }

  clear(): this {
    return this;
  }

  // Add any other methods used in your code
  circle(_x: number, _y: number, _radius: number): this {
    return this;
  }

  stroke(): this {
    return this;
  }

  fill(): this {
    return this;
  }

  // Add setFillStyle method for compatibility with PixiJS v8
  setFillStyle(_options: { color: number; alpha?: number }): this {
    return this;
  }

  // Add roundRect method for compatibility with PixiJS v8
  roundRect(
    _x: number,
    _y: number,
    _width: number,
    _height: number,
    _radius: number
  ): this {
    return this;
  }

  // Add setStrokeStyle method for compatibility with PixiJS v8
  setStrokeStyle(_options: {
    color: number;
    width?: number;
    alpha?: number;
  }): this {
    return this;
  }

  // Add moveTo and lineTo methods
  moveTo(_x: number, _y: number): this {
    return this;
  }

  lineTo(_x: number, _y: number): this {
    return this;
  }
}

// Mock pixi.js imports
vi.mock("pixi.js", () => {
  return {
    Container: class {},
    Graphics: MockGraphics,
    Text: class {
      constructor(text: string, style: Record<string, unknown>) {
        this.text = text;
        this.style = style;
      }
      text: string;
      style: Record<string, unknown>;
    },
  };
});

// Create a proper spy for the extend function
const extendSpy = vi.fn();

// Create a robust renderer mock with all needed methods
const rendererMock = {
  on: vi.fn(),
  off: vi.fn(),
  plugins: {},
  view: document.createElement("canvas"),
  screen: { width: 800, height: 600 },
  resize: vi.fn(),
  render: vi.fn(),
  clear: vi.fn(),
};

// Mock @pixi/react with proper React components
vi.mock("@pixi/react", () => {
  return {
    Application: ({
      children,
      width,
      height,
      backgroundColor,
      antialias,
      resizeTo,
      autoDensity,
      resolution,
      powerPreference,
      ...rest
    }: {
      children?: React.ReactNode;
      width: number;
      height: number;
      backgroundColor: number;
      antialias: boolean;
      resizeTo?: Window;
      autoDensity?: boolean;
      resolution?: number;
      powerPreference?: string;
      [key: string]: any;
    }) =>
      React.createElement(
        "div",
        {
          "data-testid": "pixi-application",
          "data-width": width,
          "data-height": height,
          "data-background-color": backgroundColor,
          "data-antialias": antialias,
          "data-auto-density": autoDensity,
          "data-resolution": resolution,
          "data-power-preference": powerPreference,
          ...rest,
        },
        children
      ),
    extend: extendSpy,
    useApplication: vi.fn(() => ({
      app: {
        screen: { width: 800, height: 600 },
        renderer: rendererMock,
        stage: {},
        view: document.createElement("canvas"),
      },
    })),
    Stage: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: any;
    }) =>
      React.createElement(
        "div",
        { "data-testid": "pixi-stage", ...props },
        children
      ),
    Container: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: any;
    }) =>
      React.createElement(
        "div",
        { "data-testid": "pixi-container", ...props },
        children
      ),
    Graphics: ({
      draw,
      ...props
    }: {
      draw?: (g: any) => void;
      [key: string]: any;
    }) =>
      React.createElement("div", {
        "data-testid": "pixi-graphics",
        "data-has-draw": Boolean(draw),
        ...props,
      }),
    Text: ({
      text,
      style,
      ...props
    }: {
      text: string;
      style?: any;
      [key: string]: any;
    }) =>
      React.createElement(
        "div",
        { "data-testid": "pixi-text", "data-text": text, ...props },
        text
      ),
    useTick: vi.fn((callback) => callback && callback(0.1)),
  };
});

// Mock @pixi/ui components
vi.mock("@pixi/ui", () => ({
  Button: vi.fn().mockImplementation(() => ({})),
  FancyButton: ({
    text,
    onPress,
    ...props
  }: {
    text?: string;
    onPress?: () => void;
    [key: string]: any;
  }) =>
    React.createElement(
      "button",
      {
        "data-testid": "pixi-fancy-button",
        onClick: onPress,
        ...props,
      },
      text
    ),
}));

// Mock @pixi/layout components
vi.mock("@pixi/layout/components", () => ({
  LayoutContainer: ({
    children,
    layout,
    ...props
  }: {
    children?: React.ReactNode;
    layout?: any;
    [key: string]: any;
  }) =>
    React.createElement(
      "div",
      {
        "data-testid": "layout-container",
        "data-layout": JSON.stringify(layout || {}),
        ...props,
      },
      children
    ),
}));

// Mock @pixi/layout/react and @pixi/layout
vi.mock("@pixi/layout/react", () => ({}));
vi.mock("@pixi/layout", () => ({}));

// Define interface for JSX intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pixiContainer: React.HTMLAttributes<HTMLDivElement> & {
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
        layout?: Record<string, unknown>;
        ref?: React.Ref<unknown>;
      };
      pixiGraphics: React.HTMLAttributes<HTMLDivElement> & {
        draw?: (graphics: unknown) => void;
        x?: number;
        y?: number;
        alpha?: number;
        visible?: boolean;
        rotation?: number;
        scale?: number | { x: number; y: number };
        pivot?: { x: number; y: number };
      };
      pixiText: React.HTMLAttributes<HTMLDivElement> & {
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
      pixiFancyButton: React.HTMLAttributes<HTMLDivElement> & {
        defaultView?: Record<string, unknown>;
        hoverView?: Record<string, unknown>;
        pressedView?: Record<string, unknown>;
        text?: string;
        textStyle?: Record<string, unknown>;
        onPress?: () => void;
        x?: number;
        y?: number;
      };
      layoutContainer: React.HTMLAttributes<HTMLDivElement> & {
        layout?: Record<string, unknown>;
        ref?: React.Ref<unknown>;
      };
    }
  }
}

// Transform lowercase JSX elements to proper React components
const originalCreateElement = React.createElement;
React.createElement = function (
  type: React.ElementType | string,
  props?: Record<string, any> | null,
  ...children: React.ReactNode[]
): React.ReactElement {
  // Transform lowercase pixijs elements to divs with appropriate data attributes
  if (typeof type === "string") {
    switch (type.toLowerCase()) {
      case "pixicontainer":
      case "pixiContainer":
        return originalCreateElement(
          "div",
          {
            ...props,
            "data-testid": "pixi-container",
            "data-component-type": "container",
          },
          ...children
        );

      case "pixigraphics":
      case "pixiGraphics":
        return originalCreateElement(
          "div",
          {
            ...props,
            "data-testid": "pixi-graphics",
            "data-component-type": "graphics",
            "data-has-draw": props?.draw ? "true" : "false",
          },
          ...children
        );

      case "pixitext":
      case "pixiText":
        return originalCreateElement(
          "div",
          {
            ...props,
            "data-testid": "pixi-text",
            "data-component-type": "text",
            "data-text": props?.text,
          },
          props?.text || children
        );

      case "pixifancybutton":
      case "pixiFancyButton":
        return originalCreateElement(
          "button",
          {
            ...props,
            "data-testid": "pixi-fancy-button",
            "data-component-type": "fancy-button",
            onClick: props?.onPress,
          },
          props?.text || children
        );

      case "layoutcontainer":
      case "layoutContainer":
        return originalCreateElement(
          "div",
          {
            ...props,
            "data-testid": "layout-container",
            "data-component-type": "layout-container",
            "data-layout": props?.layout ? JSON.stringify(props.layout) : "{}",
          },
          children
        );
    }
  }

  return originalCreateElement(type, props, ...children);
} as typeof React.createElement;

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
