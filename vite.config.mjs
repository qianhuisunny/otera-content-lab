import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { writingApiPlugin } from "./server/vite-writing-api.js";

export default defineConfig(({ mode }) => ({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), writingApiPlugin({ ...loadEnv(mode, process.cwd(), ""), ...process.env })],
}));
