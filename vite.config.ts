// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/MYAI-MVP/' : '/',
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxy for home insurance API (development only)
      // TODO: Remove this proxy in production - use direct API calls
      "/api/home-insurance": {
        target: "http://35.242.155.199:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/home-insurance/, "/run-scraper"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("🔥 Home Insurance Proxy error:", err.message);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("📤 Sending Home Insurance Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("📥 Received Home Insurance Response:", proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy for car insurance API (development only)
      "/api/car-insurance": {
        target: "http://35.242.155.199:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/car-insurance/, "/run-car-scraper"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("🔥 Car Insurance Proxy error:", err.message);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("📤 Sending Car Insurance Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("📥 Received Car Insurance Response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
