const playwright = require("eslint-plugin-playwright");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: { "@typescript-eslint": tseslint, playwright },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...playwright.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.js"],
    plugins: { playwright },
    rules: {
      ...playwright.configs.recommended.rules,
    },
  },
];
