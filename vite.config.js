import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';

// Startup log to confirm this config file is being loaded by Vite.
// eslint-disable-next-line no-console
console.log('[vite-config] loaded vite.config.js');

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 5173,
        proxy: {
            '^/api': {
                // Upstream serves JSON over HTTPS. HTTP redirects to HTTPS (301).
                target: 'https://api-shm-kiosk.focalat.com',
                changeOrigin: true,
                secure: false,
                // Keep /api prefix (upstream already serves /api/*).
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq, req) => {
                        // eslint-disable-next-line no-console
                        console.log('[vite-proxy]', req.method, req.url);
                        // eslint-disable-next-line no-console
                        console.log('[vite-proxy->upstream]', proxyReq.method, proxyReq.path);
                    });
                }
            }
        }
    }
});
