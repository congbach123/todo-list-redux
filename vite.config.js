import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
//import tailwindcss from 'tailwindcss/@vite';

export default defineConfig({
  plugins: [react()],
  base: '/todo-list-redux/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@auth': path.resolve(__dirname, './src/components/auth'),
      '@homePage': path.resolve(__dirname, './src/components/homePage'),
      '@todos': path.resolve(__dirname, './src/components/todos'),
      '@tests': path.resolve(__dirname, './src/tests'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
