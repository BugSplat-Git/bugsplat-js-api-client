module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'eslint.config.js',
      '.vscode/**',
      'spec/support/**'
    ],
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        expectAsync: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jasmine: 'readonly',
        spyOn: 'readonly',
        RequestInit: 'readonly',
        fail: 'readonly',
        File: 'readonly',
        Buffer: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        Response: 'readonly',
        BodyInit: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
        ReadableStream: 'readonly',
        process: 'readonly',
        HeadersInit: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': {
        rules: require('@typescript-eslint/eslint-plugin').rules
      }
    },
    rules: {
      ...require('@eslint/js').configs.recommended.rules,
      ...require('@typescript-eslint/eslint-plugin').configs['recommended'].rules,
      'semi': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'quotes': ['error', 'single'],
    }
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['spec/fakes/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        spyOn: 'readonly'
      }
    }
  }
];