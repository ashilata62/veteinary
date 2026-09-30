import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  let envApiUrl = '';
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const match = envContent.match(/VITE_API_URL\s*=\s*(.*)/);
    if (match && match[1]) {
      envApiUrl = match[1].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch (e) {}

  const apiUrl = (envApiUrl || env.VITE_API_URL || 'http://localhost:5002').replace(/\/$/, '');

  return {
    plugins: [react()],
    server: {
      port: 5175,
      open: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
            'vendor-recharts': ['recharts'],
            'vendor-lucide':   ['lucide-react'],
          }
        }
      }
    }
  };
});
