import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Treino de Tênis de Mesa",
        short_name: "Treino TM",
        description: "App de treino, saque, táticas e campeonato de tênis de mesa",
        theme_color: "#0E2E4A",
        background_color: "#F4F6F9",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: { globPatterns: ["**/*.{js,css,html,svg,png}"] }
    })
  ],
  server: { host: true, port: 5173 }
});
