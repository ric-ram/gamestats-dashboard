// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "apps/*/eslint.config.mjs",
      "eslint.config.mjs",
      "node_modules/**",
      "apps/*/node_modules/**",
      "apps/backend/dist/**",
      "apps/frontend/.next/**",
      "apps/frontend/postcss.config.mjs",
      "prettier.config.cjs",
    ],
  },
  {
    files: [
      "apps/backend/src/**/*.{ts,tsx,js,jsx}",
      "apps/frontend/src/**/*.{ts,tsx,js,jsx}",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: [
          "./tsconfig.json",
          "./apps/backend/tsconfig.json",
          "./apps/frontend/tsconfig.json",
        ],
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
);
