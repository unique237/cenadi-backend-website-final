const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules/', 'logs/', 'coverage/', '.env', 'dist/'],
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-underscore-dangle': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'prefer-arrow-callback': 'warn',
      'no-param-reassign': ['error', { props: false }],
      'consistent-return': 'warn',
    },
  },
];
