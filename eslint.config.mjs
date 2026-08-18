import next from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/**
 * Flat config. `next lint` was removed in Next 15, so this is driven directly by
 * `npm run lint`.
 *
 * The ordering matters: eslint-config-prettier goes last so it can switch off
 * every stylistic rule the others turn on. Formatting is Prettier's job and
 * nothing else's — a rule that argues with the formatter would fail `npm run
 * check` in a way no edit could fix.
 */
export default tseslint.config(
  {
    // Build output, vendored trees and generated files. Anything listed here is
    // also listed in .prettierignore; the two should not drift.
    ignores: [
      ".next/**",
      "out/**",
      ".wrangler/**",
      "node_modules/**",
      ".claude/skills/**",
      ".impeccable/**",
      "next-env.d.ts",
      "lib/photo-widths.generated.ts",
    ],
  },

  ...next,
  ...tseslint.configs.recommended,

  {
    // Build scripts are Node ESM, not browser code, and they are allowed to talk
    // to the terminal — reporting what they resized is the point of them.
    files: ["scripts/**/*.mjs", "*.config.{ts,mjs}"],
    rules: {
      "no-console": "off",
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // The codebase has zero `any` today. Keeping it that way is cheaper than
      // getting it back.
      "@typescript-eslint/no-explicit-any": "error",

      // Unused code is the thing this whole pass exists to remove, so it fails
      // rather than warns. A deliberate placeholder prefixes with _.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // console.log left in a component ships to every visitor. Warnings that
      // are genuinely wanted (a build script explaining itself) are covered by
      // the scripts/ block above.
      "no-console": ["error", { allow: ["warn", "error"] }],

      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-var": "error",
      "prefer-const": "error",
    },
  },

  prettier,
);
