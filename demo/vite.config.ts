import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Resolve 'doodle-callout' imports directly to the library source.
      // This gives instant HMR — no build step required during local dev.
      'doodle-callout': path.resolve(__dirname, '../src/index.ts'),
    },
  },
});
