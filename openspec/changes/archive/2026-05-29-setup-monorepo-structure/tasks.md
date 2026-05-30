## 1. Raiz do Monorepo

- [x] 1.1 Criar `package.json` raiz com `name: "ministack-ui"`, `private: true`, scripts `dev`, `build`, `lint`, `test` delegando ao Turborepo, e `engines` com versões mínimas de Node e pnpm
- [x] 1.2 Criar `pnpm-workspace.yaml` declarando `packages: ["apps/*", "packages/*"]`
- [x] 1.3 Criar `turbo.json` com pipelines `build` (dependsOn: `^build`, outputs: `.next/**`, `dist/**`), `dev` (persistent: true), `lint` e `test`
- [x] 1.4 Criar `tsconfig.base.json` com `strict: true`, `target: "ES2022"`, `moduleResolution: "bundler"`, `jsx: "preserve"`, `paths` para todos os packages internos
- [x] 1.5 Criar `.npmrc` com `shamefully-hoist=false` e `strict-peer-dependencies=false`
- [x] 1.6 Criar `.gitignore` abrangente (node_modules, .turbo, .next, dist, .env\*, .storybook-out, artefatos de IDE)
- [x] 1.7 Criar `.nvmrc` com versão LTS do Node.js (v22)

## 2. Ferramentas de Qualidade

- [x] 2.1 Instalar e configurar Husky (`pnpm add -Dw husky`) e inicializar com `npx husky init`
- [x] 2.2 Criar hook `pre-commit` executando `pnpm lint-staged`
- [x] 2.3 Criar hook `commit-msg` executando `npx --no -- commitlint --edit "$1"`
- [x] 2.4 Instalar `@commitlint/cli` e `@commitlint/config-conventional` e criar `commitlint.config.ts`
- [x] 2.5 Instalar `lint-staged` e criar `.lintstagedrc.json` com regras para `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`
- [x] 2.6 Criar `.prettierrc` na raiz com configurações base (singleQuote, semi, tabWidth, trailingComma)
- [x] 2.7 Criar `.prettierignore` cobrindo `node_modules`, `dist`, `.next`, `.turbo`

## 3. packages/eslint-config

- [x] 3.1 Criar `packages/eslint-config/package.json` com `name: "@ministack-ui/eslint-config"`, `private: true`
- [x] 3.2 Criar `packages/eslint-config/base.js` com flat config para TypeScript (typescript-eslint, prettier)
- [x] 3.3 Criar `packages/eslint-config/next.js` estendendo base com regras Next.js e `no-restricted-imports` para `@aws-sdk/*`
- [x] 3.4 Criar `packages/eslint-config/react-internal.js` para packages React internos

## 4. packages/shared

- [x] 4.1 Criar `packages/shared/package.json` com `name: "@ministack-ui/shared"`, exports apontando para `./src/index.ts`
- [x] 4.2 Criar `packages/shared/tsconfig.json` estendendo `tsconfig.base.json`
- [x] 4.3 Criar `packages/shared/src/types.ts` com `ApiResponse<T>`, `PaginatedResponse<T>`, `ServiceStatus`
- [x] 4.4 Criar `packages/shared/src/constants.ts` com `RUNTIME_PROVIDERS`
- [x] 4.5 Criar `packages/shared/src/index.ts` exportando tudo de `types.ts` e `constants.ts`
- [x] 4.6 Criar `packages/shared/eslint.config.mjs` estendendo `@ministack-ui/eslint-config/base`

## 5. packages/ui

- [x] 5.1 Criar `packages/ui/package.json` com `name: "@ministack-ui/ui"`, peerDependencies React e React DOM, Tailwind CSS
- [x] 5.2 Criar `packages/ui/tsconfig.json` estendendo base com `jsx: "preserve"`
- [x] 5.3 Criar arquivos placeholder para: `Button.tsx`, `LogViewer.tsx`, `JsonTree.tsx`, `EventTimeline.tsx`, `QueueCard.tsx` em `packages/ui/src/components/`
- [x] 5.4 Criar `packages/ui/src/index.ts` exportando todos os componentes
- [x] 5.5 Criar `packages/ui/eslint.config.mjs` estendendo `@ministack-ui/eslint-config/react-internal`

## 6. packages/runtime-sdk

- [x] 6.1 Criar `packages/runtime-sdk/package.json` com `name: "@ministack-ui/runtime-sdk"` e dependências AWS SDK v3 (`client-sqs`, `client-sns`, `client-secrets-manager`, `client-s3`)
- [x] 6.2 Criar `packages/runtime-sdk/tsconfig.json` estendendo base
- [x] 6.3 Criar `packages/runtime-sdk/src/types.ts` com interface `RuntimeProvider`
- [x] 6.4 Criar `packages/runtime-sdk/src/providers/MiniStackProvider.ts` implementando `RuntimeProvider` com stubs
- [x] 6.5 Criar `packages/runtime-sdk/src/providers/LocalStackProvider.ts` implementando `RuntimeProvider` com stubs
- [x] 6.6 Criar `packages/runtime-sdk/src/providers/AwsProvider.ts` implementando `RuntimeProvider` com stubs
- [x] 6.7 Criar `packages/runtime-sdk/src/index.ts` exportando interface e providers
- [x] 6.8 Criar `packages/runtime-sdk/eslint.config.mjs` estendendo `@ministack-ui/eslint-config/base`

## 7. packages/log-engine

- [x] 7.1 Criar `packages/log-engine/package.json` com `name: "@ministack-ui/log-engine"`
- [x] 7.2 Criar `packages/log-engine/tsconfig.json` estendendo base
- [x] 7.3 Criar `packages/log-engine/src/types.ts` com tipo `LogEntry`
- [x] 7.4 Criar `packages/log-engine/src/index.ts` com funções stub: `parseLog`, `correlateLog`, `filterLog`, `formatLog`
- [x] 7.5 Criar `packages/log-engine/eslint.config.mjs` estendendo `@ministack-ui/eslint-config/base`

## 8. packages/event-engine

- [x] 8.1 Criar `packages/event-engine/package.json` com `name: "@ministack-ui/event-engine"`
- [x] 8.2 Criar `packages/event-engine/tsconfig.json` estendendo base
- [x] 8.3 Criar `packages/event-engine/src/types.ts` com tipo `DistributedEvent`
- [x] 8.4 Criar `packages/event-engine/src/index.ts` com funções stub: `traceEvent`, `replayEvent`, `buildTimeline`, `linkPayload`
- [x] 8.5 Criar `packages/event-engine/eslint.config.mjs` estendendo `@ministack-ui/eslint-config/base`

## 9. apps/web

- [x] 9.1 Criar `apps/web/package.json` com `name: "@ministack-ui/web"` e dependências: Next.js 15, React 19, Tailwind CSS, shadcn/ui, TanStack Query v5, Zustand, packages internos
- [x] 9.2 Criar `apps/web/next.config.ts` com `transpilePackages` para todos os `@ministack-ui/*`
- [x] 9.3 Criar `apps/web/tsconfig.json` estendendo base com `paths` e `plugins: [{ name: "next" }]`
- [x] 9.4 Criar estrutura de diretórios: `app/`, `components/`, `hooks/`, `services/`, `providers/`, `store/`, `styles/` com arquivos placeholder
- [x] 9.5 Criar `apps/web/app/layout.tsx` com `QueryClientProvider` e providers raiz
- [x] 9.6 Criar `apps/web/app/page.tsx` com página inicial placeholder
- [x] 9.7 Criar `apps/web/styles/globals.css` com diretivas Tailwind e import de shadcn/ui
- [x] 9.8 Criar `apps/web/tailwind.config.ts` incluindo paths de `@ministack-ui/ui`
- [x] 9.9 Inicializar shadcn/ui: criar `components.json`, instalar `Button`
- [x] 9.10 Criar `apps/web/eslint.config.mjs` estendendo `@ministack-ui/eslint-config/next`

## 10. apps/storybook

- [x] 10.1 Criar `apps/storybook/package.json` com `name: "@ministack-ui/storybook"` e dependências Storybook 8.x, `@storybook/nextjs`, addons essenciais e a11y
- [x] 10.2 Criar `apps/storybook/.storybook/main.ts` com framework `@storybook/nextjs` e stories pattern apontando para `packages/ui`
- [x] 10.3 Criar `apps/storybook/.storybook/preview.ts` importando globals.css e configurando Tailwind
- [x] 10.4 Criar `apps/storybook/stories/Button.stories.tsx` como story de exemplo do `@ministack-ui/ui`
- [x] 10.5 Criar `apps/storybook/tsconfig.json` estendendo base

## 11. apps/docs

- [x] 11.1 Criar `apps/docs/package.json` com `name: "@ministack-ui/docs"` e dependências Next.js e Nextra v2
- [x] 11.2 Criar `apps/docs/next.config.mjs` com configuração do Nextra e tema `nextra-theme-docs`
- [x] 11.3 Criar `apps/docs/pages/index.mdx` com introdução ao projeto
- [x] 11.4 Criar `apps/docs/theme.config.tsx` com título, logo e navegação básica
- [x] 11.5 Criar `apps/docs/tsconfig.json` estendendo base

## 12. Instalação e Validação

- [x] 12.1 Executar `pnpm install` na raiz e verificar que todos os workspaces têm dependências resolvidas
- [x] 12.2 Verificar que `pnpm build` na raiz completa sem erros
- [x] 12.3 Verificar que `pnpm dev` inicia `apps/web` em `localhost:3000` sem erros
- [x] 12.4 Verificar que `pnpm storybook` inicia sem erros
- [x] 12.5 Verificar que `pnpm lint` passa em todos os workspaces
- [x] 12.6 Testar hook de commit com mensagem inválida e válida
