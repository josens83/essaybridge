import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['react-icons'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Minify for production
    minify: 'esbuild',
  },
  // Preview server configuration
  preview: {
    port: 3000,
    strictPort: true,
  },
  // Development server configuration
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
})
