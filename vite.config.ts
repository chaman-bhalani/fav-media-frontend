import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // function-based manualChunks: split antd by internal folders (component-level)
        manualChunks(id) {
          if (!id) return;
          // put other node_modules into 'vendor'
          if (id.includes("node_modules")) {
            // split antd internals into per-folder chunks (antd/es/Button -> antd-Button)
            if (id.includes("node_modules/antd/")) {
              const m = id.match(/node_modules\/antd\/(?:es|lib)\/([^/]+)/);
              const key = m ? m[1] : "antd";
              return `antd-${key}`;
            }
            // keep other libs together
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
