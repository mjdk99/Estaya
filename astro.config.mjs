import { defineConfig } from "astro/config";

// Hosting already serves public/. Astro's static source folder is static/
// so the build can write the deployable site into public/ without mixing them.
export default defineConfig({
  trailingSlash: "always",
  output: "static",
  compressHTML: true,
  outDir: "./public",
  publicDir: "./static",
  build: {
    format: "directory",
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
