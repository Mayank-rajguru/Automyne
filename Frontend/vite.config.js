import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const manifestForPlugIn = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: "Automyne",
    short_name: "Automyne",
    description: "AI-Powered Market Intelligence",
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    start_url: "/",
    scope: "/",
    orientation: "portrait",
    icons: [
      { src: "/icons/download192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/download512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/download180.png", sizes: "180x180", type: "image/png", purpose: "maskable" }
    ]
  }
};

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(manifestForPlugIn)]
})
