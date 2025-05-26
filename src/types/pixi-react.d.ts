import type { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { ReactNode } from "react";

// Only declare the module for react-reconciler constants fix
declare module "react-reconciler/constants" {
  export * from "react-reconciler/constants.js";
}

export {};
