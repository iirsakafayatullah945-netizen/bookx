import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['capture-checks-connectivity-knew.trycloudflare.com'],
  },
})