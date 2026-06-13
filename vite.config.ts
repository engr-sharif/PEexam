import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path for GitHub Pages project site: https://<user>.github.io/<repo>/
// Override with VITE_BASE if the repo name differs.
const base = process.env.VITE_BASE ?? '/peexam/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
