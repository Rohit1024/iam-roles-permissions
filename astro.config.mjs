// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  integrations: [tailwind({
    applyBaseStyles: false,
  }), , react()],

  adapter: node({
    mode: 'standalone'
  })
});