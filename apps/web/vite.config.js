
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import process from 'node:process'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    proxy: Object.fromEntries(
      ['/auth', '/exams', '/questions', '/attempts', '/leaderboard'].map(
        (route) => [route, {
          target: process.env.API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        }],
      ),
    ),
  },
})
