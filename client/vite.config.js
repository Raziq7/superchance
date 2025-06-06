import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // This ensures assets use relative paths
  build: {
    outDir: 'dist-react',
  }
})