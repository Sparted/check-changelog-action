module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: '@sparted',
  ignorePatterns: ['.eslintrc.js'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
};
