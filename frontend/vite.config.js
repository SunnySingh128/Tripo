import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    proxy:{
      '/api':{
        target : 'https://tripo-yr8l.onrender.com',
        changeOrigin : true
      }
    }
  }
})
