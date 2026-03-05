import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   preview: {
    host: true,          // bind 0.0.0.0
    port: Number(process.env.PORT) || 4173,
    allowedHosts: [
      "inventoryforedukarya-production.up.railway.app",
    ],
  },
})
