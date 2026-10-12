import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/game.css";
import "./styles/personalization.css";
import "./styles/magic.css";
import "./styles/easter-eggs.css";
import "./styles/world-upgrade.css";
import "./styles/performance.css";
import "./styles/seal-secret.css";
import "./styles/little-life.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
