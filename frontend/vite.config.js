import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        watch: {
            usePolling: true
        },
        proxy: {
            '/api': {
                target: 'http://whatsapp-backend:5000',  // ← Continua 5000 (porta interna do container)
                changeOrigin: true,
                secure: false
            }
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom']
    }
})