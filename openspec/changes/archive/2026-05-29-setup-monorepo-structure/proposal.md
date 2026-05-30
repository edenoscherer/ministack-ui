## Why

O projeto ministack-ui não possui estrutura de código — apenas documentação de arquitetura. É preciso scaffoldar o monorepo completo (Turborepo + pnpm workspaces) com todos os apps e packages definidos no doc de arquitetura, criando a fundação que tornará possível toda a implementação futura.

## What Changes

- Inicializar o monorepo com Turborepo + pnpm workspaces
- Criar `apps/web` — aplicação Next.js 15 com Tailwind, shadcn/ui, TanStack Query e Zustand
- Criar `apps/storybook` — app de desenvolvimento isolado de UI
- Criar `apps/docs` — app de documentação pública com Nextra
- Criar `packages/ui` — pacote de componentes reutilizáveis
- Criar `packages/runtime-sdk` — abstração de runtimes (MiniStack/LocalStack/AWS)
- Criar `packages/log-engine` — engine de processamento de logs
- Criar `packages/event-engine` — engine de fluxo distribuído
- Criar `packages/shared` — utilitários e tipos compartilhados
- Criar `packages/eslint-config` — configuração compartilhada de ESLint + Prettier
- Configurar ferramentas de qualidade: TypeScript strict, Husky, Conventional Commits

## Capabilities

### New Capabilities

- `monorepo-workspace`: Configuração raiz do Turborepo, pnpm-workspace.yaml, root package.json e turbo.json com pipelines de build/dev/lint/test
- `app-web`: Scaffold da aplicação Next.js 15 principal com roteamento, providers e estrutura de diretórios (app/, components/, hooks/, services/, providers/, store/, styles/)
- `app-storybook`: Aplicação Storybook configurada com suporte a Tailwind e consumo de `packages/ui`
- `app-docs`: Aplicação Nextra para documentação pública
- `pkg-ui`: Pacote de componentes React reutilizáveis (Button, LogViewer, JsonTree, EventTimeline, QueueCard) exportados com tipagem TypeScript
- `pkg-runtime-sdk`: Interface `RuntimeProvider` e providers concretos (MiniStackProvider, LocalStackProvider, AwsProvider) com AWS SDK v3
- `pkg-log-engine`: Módulo de parsing, correlação, filtragem e formatação de logs
- `pkg-event-engine`: Módulo de event tracing, replay, timeline e payload linking
- `pkg-shared`: Tipos, constantes e utilitários compartilhados entre apps e packages
- `pkg-eslint-config`: Configuração centralizada de ESLint + Prettier consumida por todos os workspaces
- `dev-tooling`: Husky hooks (pre-commit, commit-msg), Conventional Commits, TypeScript strict mode, .gitignore, .nvmrc

### Modified Capabilities

## Impact

- Cria toda a estrutura de diretórios do repositório do zero
- Define `pnpm-workspace.yaml` e raiz de `package.json` — impacta como todos os pacotes são instalados e resolvidos
- Define `turbo.json` com pipelines — impacta todos os comandos de build/dev/test
- Nenhuma feature de produto é alterada (não existe código de produto ainda)
