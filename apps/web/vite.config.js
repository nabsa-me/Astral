import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Astral/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
}));
