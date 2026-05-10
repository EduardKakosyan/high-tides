import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["node_modules", ".next", "out", "build", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "dist/**",
        "coverage/**",
        "**/*.config.{js,ts}",
        "**/*.d.ts",
        "vitest.setup.ts",
        "src/app/**",
        "src/lib/cld-client.ts",
        "src/lib/cloudinary.ts",
        "src/lib/media.ts",
        "src/components/sections/Hero.tsx",
        "src/components/sections/Gallery.tsx",
        "src/components/layout/SmoothScroll.tsx",
      ],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
