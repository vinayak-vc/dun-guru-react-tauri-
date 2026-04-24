import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
// Startup log to confirm this config file is being loaded by Vite.
// eslint-disable-next-line no-console
console.log('[vite-config] loaded vite.config.ts');
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
                target: 'https://api-shm-kiosk.focalat.com',
                changeOrigin: true,
                secure: false,
                // Keep /api prefix (upstream already serves /api/*).
                // Also rewrite redirect Location headers back to the proxy to avoid browser CORS.
                configure: function (proxy) {
                    proxy.on('proxyReq', function (proxyReq, req) {
                        // eslint-disable-next-line no-console
                        console.log('[vite-proxy]', req.method, req.url);
                        // eslint-disable-next-line no-console
                        console.log('[vite-proxy->upstream]', proxyReq.method, proxyReq.path);
                    });
                    proxy.on('proxyRes', function (proxyRes) {
                        var location = proxyRes.headers.location;
                        if (typeof location !== 'string')
                            return;
                        var upstreamPrefix = 'https://api-shm-kiosk.focalat.com';
                        if (location.startsWith(upstreamPrefix)) {
                            proxyRes.headers.location = "/api".concat(location.slice(upstreamPrefix.length));
                        }
                    });
                },
            },
        },
    }
});
