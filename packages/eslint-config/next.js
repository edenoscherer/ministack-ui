import { FlatCompat } from '@eslint/eslintrc';
import baseConfig from './base.js';
import tseslint from 'typescript-eslint';

/**
 * Factory that creates the Next.js ESLint flat config.
 * Accepts `baseDirectory` (import.meta.dirname of the consuming app)
 * so that FlatCompat can resolve `eslint-config-next` from the app.
 *
 * @param {{ baseDirectory: string }} options
 */
export function createNextConfig({ baseDirectory }) {
  const compat = new FlatCompat({ baseDirectory });

  return tseslint.config(...compat.extends('next/core-web-vitals'), ...baseConfig, {
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
}
