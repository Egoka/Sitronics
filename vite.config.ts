import { fileURLToPath, URL } from 'node:url'

// @ts-ignore
import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist', // Директория, в которую будут собраны файлы
    assetsDir: 'assets', // Директория, в которую будут скопированы статические ресурсы (например, изображения)
    sourcemap: true, // Генерировать ли sourcemaps для собранных файлов (для отладки)
    minify: true, // Минифицировать ли собранный код
    // terserOptions: {
    //   compress: {
    //     drop_console: true, // Удалить лишние console.log вызовы из кода
    //   },
    // },
  }
})
