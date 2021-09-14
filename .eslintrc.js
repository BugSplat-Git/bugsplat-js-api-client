module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'semi': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
  },
  overrides: [
    {
      'files': ['**/*.spec.ts', '**/*.e2e.ts'],
      'rules': {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      'files': ['spec/fakes/**/*'],
      'rules': {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
};