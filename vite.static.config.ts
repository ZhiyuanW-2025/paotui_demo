import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

// The showcase uses browser-local data and does not need a server runtime.
// Keep the original Vinext build available, and export this SPA for Nginx hosting.
export default defineConfig({
  root: resolve(projectRoot, "web"),
  publicDir: resolve(projectRoot, "public"),
  plugins: [react()],
  resolve: { alias: { "@": projectRoot } },
  build: {
    outDir: resolve(projectRoot, "dist-static"),
    emptyOutDir: true,
  },
});
