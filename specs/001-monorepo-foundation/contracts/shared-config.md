# Contract: Shared Config (`@ministack/eslint-config`)

Superfície pública do pacote de configuração compartilhada. Qualquer pacote/app do workspace
consome estes exports por extensão, sem duplicar regras.

## Exports (`package.json`)

```jsonc
{
  "name": "@ministack/eslint-config",
  "exports": {
    "./base": "./base.js", // ESLint flat config
    "./tsconfig": "./tsconfig.base.json",
  },
}
```

## Contrato ESLint (`./base`)

- Formato: **flat config** (array), compatível com ESLint 9.
- Composição: `@eslint/js` recomendado + `typescript-eslint` (type-checked) + `eslint-config-prettier`.
- Consumo:

  ```js
  // packages/<pkg>/eslint.config.js
  import base from '@ministack/eslint-config/base'
  export default [...base, {/* overrides pontuais deste pacote, se necessário */}]
  ```

- Garantia: extensão + override pontual funciona sem redefinir a base (edge case da spec).

## Contrato TypeScript (`./tsconfig`)

- `compilerOptions` com no mínimo: `strict: true`, `noUncheckedIndexedAccess: true`,
  `noImplicitOverride: true`, `isolatedModules: true`.
- Consumo:

  ```jsonc
  // packages/<pkg>/tsconfig.json
  { "extends": "@ministack/eslint-config/tsconfig", "include": ["src"] }
  ```

- Garantia (FR-009): qualquer pacote que estenda herda strict; código com `any` implícito
  ou índice não checado falha em `typecheck`.

## Critérios de verificação

1. Pacote que estende `./base` e viola uma regra ⇒ `turbo run lint` falha apontando o arquivo/linha
   (Acceptance US2 #1).
2. Pacote que estende `./tsconfig` com erro de tipo (ex.: `any` implícito) ⇒ `turbo run typecheck`
   falha (Acceptance US2 #2).
3. `@ministack/shared` importado por outro pacote resolve via `workspace:*` sem build manual
   (Acceptance US2 #3).

## Decisão: consumo source-first

Pacotes internos (`packages/*`) são consumidos como **código TypeScript-fonte**: `main`/`types`/
`exports` de `@ministack/shared` apontam para `./src/index.ts`, não para `dist/`. Isso satisfaz
FR-003/Acceptance US2 #3 (import sem build prévio) porque os consumidores (Vitest agora; Next.js
com `transpilePackages` nas specs 003+) transpilam o `.ts` diretamente. O script `build`
(`tsc -p tsconfig.build.json` → `dist/`) existe para validar a emissão de tipos/`.d.ts` e manter
o nó `build` do pipeline verde, mas `dist/` não é o entrypoint de resolução interna. Um consumidor
que precise resolver via Node puro (sem bundler) deve apontar para `./dist` — decisão a revisitar
apenas quando/se um `apps/*` empacotar `shared` fora de um bundler.
