import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL ?? 'http://localhost:8080',
  build: { inlineStylesheets: 'never' },
  vite: {
    build: {
      sourcemap: false,
      assetsInlineLimit: 0,
      minify: 'esbuild',
      cssMinify: true
    }
  }
});
