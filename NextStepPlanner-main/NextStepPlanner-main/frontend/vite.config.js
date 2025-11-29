import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure public assets are properly copied to dist
  publicDir: "public",
  build: {
    copyPublicDir: true,
    assetsDir: "assets",
  },
});
