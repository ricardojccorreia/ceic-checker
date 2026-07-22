import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' -> caminhos relativos, funciona bem em GitHub Pages (projeto)
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
