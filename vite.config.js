import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://sbgneto.github.io/plataforma/ (GitHub Pages project site).
  base: '/plataforma/',
  build: {
    // GitHub Pages is configured to publish from the /docs folder on main.
    outDir: 'docs',
  },
})
