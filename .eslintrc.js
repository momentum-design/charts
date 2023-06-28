module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:wc/recommended',
    'plugin:lit/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
        version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off'
  },
};
