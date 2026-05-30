## Context

O repositório existe mas não tem código — apenas documentação arquitetural (doc.md). A stack escolhida é Turborepo + pnpm workspaces com Next.js 15, Storybook, Nextra e múltiplos packages internos. Este design define as decisões técnicas para scaffoldar a fundação do monorepo de forma que suporte o desenvolvimento de todas as sprints futuras sem refatorações de estrutura.

## Goals / Non-Goals

**Goals:**

- Definir a estrutura exata de diretórios e arquivos de configuração do monorepo
- Estabelecer o grafo de dependências entre workspaces
- Definir a estratégia de TypeScript (tsconfig base + extends por workspace)
- Definir o pipeline do Turborepo (build, dev, lint, test)
- Configurar ferramentas de qualidade (Husky, commitlint, ESLint, Prettier)
- Garantir que `pnpm dev` em qualquer app funcione imediatamente

**Non-Goals:**

- Implementar qualquer lógica de produto (logs, queues, SNS, etc.)
- Configurar Docker ou conexão com MiniStack/LocalStack
- Criar componentes UI além de arquivos de índice
- Configurar CI/CD

## Decisions

### Turborepo como orquestrador de monorepo

**Decisão**: Usar Turborepo v2 sobre Nx.  
**Rationale**: Configuração mínima (`turbo.json` único), caching remoto nativo, integração first-class com Next.js e Vercel, comunidade maior. Nx tem mais features mas impõe mais overhead de configuração.  
**Alternativas consideradas**: Nx (mais robusto mas complexo), Lerna (legado).

### pnpm como package manager

**Decisão**: pnpm com workspace protocol (`workspace:*`).  
**Rationale**: Installs mais rápidos que npm/yarn, hoisting correto evitando phantom dependencies, protocolo `workspace:*` garante que packages internos sempre referenciam a versão local.  
**Alternativas consideradas**: npm workspaces (mais lento, menos rigoroso com hoisting), Yarn Berry (PnP pode causar incompatibilidades).

### Estratégia de TypeScript: tsconfig base com extends

**Decisão**: Um `packages/tsconfig` (ou `tsconfig.base.json` na raiz) com `strict: true`, cada workspace o extende.  
**Rationale**: Evita duplicação de configuração. Permite que cada workspace customize apenas o necessário (ex: `jsx` para React, `moduleResolution` para Node).  
**Alternativas consideradas**: tsconfig independente por workspace (inconsistência entre projetos).

### Packages internos sem build step inicial

**Decisão**: Packages internos (`packages/*`) usam `exports` apontando para `src/index.ts` diretamente, sem etapa de build (`tsup`/`tsc`) no scaffold inicial.  
**Rationale**: Para desenvolvimento local o TypeScript resolve caminhos via path aliases. Build step (tsup) é adicionado quando o package precisar ser publicado ou consumido por código não-TypeScript. Reduz complexidade inicial.  
**Alternativas consideradas**: tsup desde o início (overhead desnecessário antes de ter código real).

### ESLint config como package interno

**Decisão**: `packages/eslint-config` exporta configurações compartilhadas.  
**Rationale**: Padrão recomendado pelo Turborepo. Evita divergência de regras entre workspaces. Cada workspace estende com `eslint-config-ministack-ui`.  
**Alternativas consideradas**: `.eslintrc` na raiz com overrides (dificulta customização por workspace).

### Storybook 8.x no apps/storybook

**Decisão**: App dedicado `apps/storybook` com `@storybook/nextjs` e Tailwind configurado.  
**Rationale**: Isola o Storybook como aplicação própria no monorepo, separando preocupações. Pode ter seu próprio `pnpm dev` e não polui o `apps/web`.  
**Alternativas consideradas**: Storybook dentro do `apps/web` (acoplamento desnecessário).

## Risks / Trade-offs

| Risco                                                        | Mitigação                                                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Compatibilidade entre versões de Tailwind nos múltiplos apps | Usar versão única no root, consumida via peer dependency                              |
| Path aliases TypeScript não funcionarem no Storybook         | Configurar `webpackFinal` no `.storybook/main.ts` com `tsconfig-paths-webpack-plugin` |
| pnpm hoisting bloqueando imports em apps                     | Definir `public-hoist-pattern` no `.npmrc` para pacotes que exigem hoisting           |
| Turborepo cache invalidation em desenvolvimento              | Usar `--no-cache` durante dev, cache apenas em CI                                     |
| `packages/ui` sendo importado antes de ter conteúdo real     | Criar arquivos `index.ts` com export vazio para permitir setup sem erros              |

## Open Questions

- `packages/tsconfig` como workspace separado ou apenas `tsconfig.base.json` na raiz? (Preferência: raiz, mais simples)
- Nextra v2 ou v3? (v3 está em beta — usar v2 estável inicialmente)
- Adicionar Vitest como test runner desde o scaffold ou em sprint futura? (Recomendado: incluir configuração base mesmo sem testes)
