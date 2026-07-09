import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

/**
 * Shared ESLint flat config for MiniStack UI packages.
 *
 * Uses type-aware ("type-checked") typescript-eslint rules for `.ts`/`.tsx`
 * sources via the project service, and disables them for plain JS / config
 * files (which are not part of a TS program).
 *
 * Consume by extension:
 *
 *   import base from '@ministack/eslint-config/base'
 *   export default [...base, { \/* package-specific overrides *\/ }]
 */
export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        // Resolve the nearest tsconfig for each linted file automatically.
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Type-aware rules require a TS program; turn them off for JS and config
  // files, which are not included in any package tsconfig.
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.config.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  // Disable stylistic rules that conflict with Prettier — keep this LAST.
  prettier,
)
