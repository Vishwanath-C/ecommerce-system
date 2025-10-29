import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendTarget = "http://localhost:8080";

const proxyRoutes = ["/auth", "/categories", "/users", "/cart", "/products"];
const proxyConfig = proxyRoutes.reduce((acc, route) => {
    acc[route] = {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
    };
    return acc;
}, {});

export default defineConfig({
    plugins: [react()],
    server: {
        host: '127.0.0.1',
        port: 5176,
        proxy: proxyConfig,
    }
});
