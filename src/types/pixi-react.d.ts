import type { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { ReactNode } from "react";
import type { PixiReactElementProps } from "@pixi/react";
import type { FancyButton, ButtonOptions } from "@pixi/ui";
import "@pixi/layout/react";

// Only declare the module for react-reconciler constants fix
declare module "react-reconciler/constants" {
  export * from "react-reconciler/constants.js";
}

// Declare custom components in the @pixi/react module
declare module "@pixi/react" {
  interface PixiElements {
    pixiFancyButton: PixiReactElementProps<typeof FancyButton> &
      ButtonOptions & {
        onPress?: () => void;
      };
  }
}

export {};
