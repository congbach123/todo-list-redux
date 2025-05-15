import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.js'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@auth': path.resolve(__dirname, './src/components/auth'),
      '@todos': path.resolve(__dirname, './src/components/todos'),
      '@tests': path.resolve(__dirname, './src/tests'),
    },
  },
});
