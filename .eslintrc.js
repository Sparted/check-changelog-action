/* eslint-disable @sparted/import/no-unused-modules -- Exception for the eslint config file */
/* eslint-disable @sparted/import/no-commonjs -- Exception for the eslint config file */

const OFF = 'off';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@sparted',
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@sparted/common',
  ],
  env: {
    node: true,
  },
  rules: {
    // The presets for this rule are too violent
    'no-magic-numbers': [OFF],

    // This project is server-side only
    '@sparted/import/no-nodejs-modules': [OFF],

    // Incompatible with typescript extensions
    '@sparted/import/no-unresolved': [OFF],

    // Incompatible with typescript extensions
    '@sparted/import/extensions': [OFF],

    // Preference for this project
    '@sparted/import/prefer-default-export': [OFF],

    // Promise is defined
    '@sparted/promise/no-native': [OFF],

    // Not needed for this package
    '@sparted/import/unambiguous': [OFF],
  },
};

/* eslint-enable @sparted/import/no-unused-modules */
/* eslint-enable @sparted/import/no-commonjs */
