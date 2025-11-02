import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";

// Custom fallback component for error handling
function ErrorFallback({ error }: { error: Error }): React.ReactElement {
  return (
    <div className="error-container">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={(): void => window.location.reload()}>Try again</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
