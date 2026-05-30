import { FlatCompat } from "@eslint/eslintrc";
import nextConfig from "@ministack-ui/eslint-config/next";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals"),
  ...nextConfig,
];

export default eslintConfig;
