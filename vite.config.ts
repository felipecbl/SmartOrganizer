import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  optimizeDeps: {
    // allowNodeBuiltins: ["pouchdb-browser", "pouchdb-find", "pouchdb-adapter-idb", "react-pouchdb", "pouchdb"],
  },
  server: {
    port: 1404,
  },
  preview: {
    port: 8000,
  },
});
