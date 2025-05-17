import dns from "dns";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import * as path from "path";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    open: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "https://moka-ngrok-dev.ngrok.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {
    modules: {
      generateScopedName: "[folder]_[local]__[hash:base64:5]",
    },
  },
  optimizeDeps: {
    include: ["@ant-design/icons"],
  },
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/*": path.resolve(__dirname, "src/*"),
    },
  },
});
