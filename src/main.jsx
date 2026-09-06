import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "@qianhui/ui/styles.css";
import "./styles.css";
import "./writing.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
