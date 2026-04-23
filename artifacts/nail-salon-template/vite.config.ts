import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    proxy: {
      "/api/public": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: isSsrBuild ? "dist/server" : "dist/client",
    emptyOutDir: true,
  },
}));
