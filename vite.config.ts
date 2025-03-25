import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import vercel from "vite-plugin-vercel";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    vercel() 
  ],
});
