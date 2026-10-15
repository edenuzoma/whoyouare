import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.TCHARIZE_API_URL || 'https://tcharizeapi-production.up.railway.app'
  const apiKey = process.env.TCHARIZE_API_KEY || env.TCHARIZE_API_KEY

  return {
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    proxy: {
      '/api/tcharize': {
        target: apiUrl,
        changeOrigin: true,
        rewrite: () => '/api/v1/localization/page',
        configure(proxy) {
          proxy.on('proxyReq', (proxyRequest) => {
            proxyRequest.removeHeader('origin')
            if (apiKey) proxyRequest.setHeader('Authorization', `Bearer ${apiKey}`)
          })
        },
      },
    },
  },
  }
})
