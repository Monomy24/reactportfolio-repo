import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Changed to matching template bundler plugin
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
