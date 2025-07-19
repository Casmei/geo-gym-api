import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: "src",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src/use-cases",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          dir: "src/http/controllers",
          environment:
            "./prisma/vitest-enviroment-prisma/prisma-test-enviroment.ts",
        },
      },
    ],
    coverage: {
      reporter: ["text", "lcov", "html"],
      include: ["src/use-cases/**/*.ts"],
      exclude: [
        "src/env/*.ts",
        "src/use-cases/errors/**/*.ts",
        "src/repositories/*.ts",
        "src/repositories/**/*.ts",
        "src/use-cases/factories/**/*.ts",
        "**/*.spec.ts",
        "**/*.test.ts",
        "node_modules",
        "dist",
        "build",
        "utils",
      ],
    },
  },
});
