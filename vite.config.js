import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Shopify library mode
  if (mode === 'shopify') {
    return {
      base: '', // Empty base for Shopify asset URLs
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/shopify-entry.jsx'),
          name: 'RockiiBuilder',
          formats: ['iife'],
          fileName: () => 'rockii-builder.iife.js'
        },
        rollupOptions: {
          // Externalize dependencies that should be loaded separately
          // For now, bundle everything for simplicity
          external: [],
          output: {
            globals: {}
          }
        }
      }
    }
  }

  // Default SPA mode (GitHub Pages)
  return {
    base: '/rockiistudios/',
    plugins: [react()],
  }
})
