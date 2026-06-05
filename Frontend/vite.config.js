import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/exam/',
  server:{
    host:true,
    port:5174,
    strictPort:true,
    cors:true,
    hmr:{
      overlay:true
    }
  }
})
