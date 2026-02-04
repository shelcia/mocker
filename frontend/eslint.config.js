import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  // --------------------------------------------------
  // Ignore config + build files
  // --------------------------------------------------
  {
    ignores: ['eslint.config.js', 'dist', 'build', 'coverage', 'node_modules', 'public'],
  },

  // --------------------------------------------------
  // Base JS (NO TypeScript project here)
  // --------------------------------------------------
  js.configs.recommended,

  // --------------------------------------------------
  // React + TS files ONLY
  // --------------------------------------------------
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
      },
      globals: globals.browser,
    },

    settings: {
      react: { version: 'detect' },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@typescript-eslint': tseslint,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    rules: {
      // ---------------- React ----------------
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // ---------------- Hooks ----------------
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ---------------- TypeScript ----------------
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      // ---------------- Unused imports ----------------
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // ---------------- Import sorting ----------------
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react/'],
            ['^@/'],
            ['^@?\\w'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\.(?!/?$)', '^\\./?$'],
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // ---------------- Spacing rules ----------------
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'switch', 'try'],
        },
        {
          blankLine: 'always',
          prev: ['if', 'for', 'while', 'switch', 'try'],
          next: '*',
        },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
  },
];
