import baseConfig from './base.js';
import tseslint from 'typescript-eslint';

/** @type {import("typescript-eslint").Config} */
export default tseslint.config(...baseConfig, {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@aws-sdk/*'],
            message:
              'AWS SDK cannot be used in frontend code. Use Route Handlers in app/api/ instead.',
          },
        ],
      },
    ],
  },
});
