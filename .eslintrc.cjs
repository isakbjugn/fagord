module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'prettier',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  ignorePatterns: ['vite-env.d.ts', 'vite.config.ts', 'api/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@tanstack/query'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-misused-promises': 'warn',
  },
};
