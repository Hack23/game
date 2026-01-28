import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Player3DDemo } from "./components/Player3DDemo.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find root element");
}

// Check if we should show Player3D demo or main game
const showPlayer3DDemo = window.location.hash === "#player3d";

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {showPlayer3DDemo ? <Player3DDemo /> : <App />}
  </React.StrictMode>
);
