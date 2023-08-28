module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: ['vite-env.d.ts', 'vite.config.ts', 'api/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    'simple-import-sort',
    '@tanstack/query',
    '@typescript-eslint',
  ],
  root: true,
  rules: {
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  settings: {
    react: {
      version: "detect",
    }
  }
};
