// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output. `site` is the canonical URL — starts on a Netlify subdomain,
// later cuts over to hitides.ca (see NOTES.md).
export default defineConfig({
  site: 'https://hi-tides.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
