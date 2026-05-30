import baseConfig from './base.js';
import tseslint from 'typescript-eslint';

/** @type {import("typescript-eslint").Config} */
export default tseslint.config(...baseConfig, {
  rules: {
    'react/display-name': 'off',
  },
});
