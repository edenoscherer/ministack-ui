import { createNextConfig } from '@ministack-ui/eslint-config/next';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'next-env.d.ts'],
  },
  ...createNextConfig({ baseDirectory: import.meta.dirname }),
];

export default eslintConfig;
