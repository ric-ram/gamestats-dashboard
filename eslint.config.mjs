import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.url });

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ),
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        project: ["./tsconfig.json"],
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: "eslint-plugin-react",
      "react-hooks": "eslint-plugin-react-hooks",
    },
    rules: {
      // enforce React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // disable prop-types (using TS)
      "react/prop-types": "off",
      // allow JSX in .tsx
      "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
