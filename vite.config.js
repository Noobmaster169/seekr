import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        overlay: resolve(__dirname, 'src/overlay.jsx')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'overlay' ? 'assets/overlay.js' : 'assets/[name]-[hash].js'
        }
      }
    }
  }
})
