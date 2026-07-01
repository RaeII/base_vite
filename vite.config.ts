import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Toda request para /api é proxiada ao backend pelo dev server.
        // O browser só fala com a origem do Vite → sem CORS, cookie httpOnly
        // fica host-only na origem do front (mais seguro que expor o backend).
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
