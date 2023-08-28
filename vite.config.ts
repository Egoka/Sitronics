import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'tailwind.config.ts': path.resolve(__dirname, 'tailwind.config.ts'),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: [
      'tailwind.config.ts',
    ]
  },
  build: {
    commonjsOptions: {
      include: ['tailwind.config.ts', 'node_modules/**'],
    },
  },
})
