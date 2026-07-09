import base from '@ministack/eslint-config/base'

// Root-level flat config: governs only repo-root JS config files
// (e.g. commitlint.config.js, this file). Each package under packages/*
// and apps/* owns its own eslint.config.js, so they are ignored here.
export default [
  {
    ignores: [
      'packages/**',
      'apps/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
    ],
  },
  ...base,
]
