import pluginJs from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser,
      globals: globals.browser,
      parserOptions: {
        // eslint-disable-next-line no-undef
        tsconfigRootDir: process.cwd(),
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },
  { settings: { react: { version: "detect" } } }, // Auto-detect React version
  {
    plugins: {
      "@next/next": pluginNext,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      prettier: pluginPrettier,
      "unused-imports": pluginUnusedImports,
    },
  },

  // Recommended base rules
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    rules: {
      // ✅ Next.js Best Practices
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,

      // ✅ TypeScript Strictness
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/strict-boolean-expressions": "off",

      // ✅ React Best Practices
      "react/jsx-boolean-value": ["error", "never"],
      "react/no-array-index-key": "off",
      "react/no-unstable-nested-components": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // ✅ Code Consistency & Security
      "no-console": "off",
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
      "no-shadow": "off",
      curly: "off",

      // ✅ Enable Prettier Formatting
      "prettier/prettier": "error",
    },
  },
];
