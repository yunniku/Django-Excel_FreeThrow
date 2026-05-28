import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // ← Docker 안에서 외부 접근 허용
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8000',  // ← Docker 서비스 이름으로 연결
        changeOrigin: true,
      },
    },
  },
});