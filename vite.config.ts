import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["antd"], // avoid premature optimization of Ant Design
  },
  build: {
    target: "esnext",
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined, // disable manual chunk splitting entirely
      },
    },
    chunkSizeWarningLimit: 1000, // optional: increase warning limit
  },
});
