import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 8888
  },
  /*css: {
    preprocessorOptions: {
      scss: {
        additionalData:'@import "./src/assets/style/main.scss";'
      }
    }
  },*/
})