import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default; // ✅ Use dynamic import
  return {
    plugins: [react(), tsconfigPaths()],
  };
});
