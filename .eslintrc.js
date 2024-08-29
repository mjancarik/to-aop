module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        bracketSameLine: false,
      },
    ],

    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'log'],
      },
    ],
  },
  plugins: ['prettier', 'jest', 'jasmine'],
  settings: {
    ecmascript: 2020,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 11,
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    globalThis: false,
  },
};
