import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o mesmo build serve tanto na subpasta do GitHub Pages
  // (https://sbgneto.github.io/plataforma/) quanto na raiz do Vercel.
  base: './',
  build: {
    // GitHub Pages publica da pasta /docs na main; o Vercel lê a mesma pasta
    // (configurado em vercel.json como outputDirectory).
    outDir: 'docs',
  },
})
