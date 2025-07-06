import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Changed from './' to '/' for proper development server path resolution
  css: {
    postcss: './postcss.config.cjs'
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
