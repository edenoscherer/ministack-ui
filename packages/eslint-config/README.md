# @ministack/eslint-config

Configuração de qualidade compartilhada do monorepo MiniStack UI: ESLint 9 (flat config) e
`tsconfig` base com TypeScript strict. Ponto único de verdade — pacotes consomem por extensão,
nunca duplicando regras.

## Exports

| Export                              | Alvo                           | Uso                                                  |
| ----------------------------------- | ------------------------------ | ---------------------------------------------------- |
| `@ministack/eslint-config/base`     | `base.js` (ESLint flat config) | `import base from '@ministack/eslint-config/base'`   |
| `@ministack/eslint-config/tsconfig` | `tsconfig.base.json`           | `{ "extends": "@ministack/eslint-config/tsconfig" }` |

## ESLint

```js
// packages/<pkg>/eslint.config.js
import base from '@ministack/eslint-config/base'

export default [
  ...base,
  {
    // overrides pontuais deste pacote (opcional) — nunca redefina a base do zero
  },
]
```

Composição: `@eslint/js` recomendado + `typescript-eslint` recomendado + `eslint-config-prettier`
(desativa regras estilísticas que conflitam com o Prettier).

## TypeScript

```jsonc
// packages/<pkg>/tsconfig.json
{
  "extends": "@ministack/eslint-config/tsconfig",
  "include": ["src"],
}
```

Herda `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `isolatedModules` e
`moduleResolution: Bundler`. Código com `any` implícito ou acesso a índice não checado falha em
`turbo run typecheck`.
