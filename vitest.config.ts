import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svgr()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'happy-dom',
  },
});
