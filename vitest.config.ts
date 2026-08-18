import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    /*
      Anywhere, rather than a list of directories. The previous config named
      lib/, content/ and worker/ explicitly, which meant a test written beside a
      component was collected by nothing and passed by never running — the worst
      possible failure mode for a test suite.
    */
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "out/**", ".wrangler/**", ".claude/**"],
  },
});
