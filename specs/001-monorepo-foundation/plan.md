# Implementation Plan: Monorepo Foundation

**Branch**: `001-monorepo-foundation` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-monorepo-foundation/spec.md`

## Summary

Estabelecer a fundação do monorepo MiniStack UI: workspace Turborepo + pnpm com
`package.json` raiz, `pnpm-workspace.yaml` e `turbo.json`; um pacote de configuração
compartilhada `packages/eslint-config` (ESLint flat config + `tsconfig` base com strict);
um pacote `packages/shared` de tipos/utilitários sem efeitos colaterais; hooks Husky
(pre-commit via lint-staged + commit-msg via commitlint/Conventional Commits); e um pipeline
raiz `build | lint | typecheck | test` com um passo de auditoria de dependências bloqueante
para vulnerabilidades crítica/alta. Abordagem: convenções de workspace nativas do pnpm +
grafo de tarefas do Turborepo com cache local, sem qualquer código de produto (apps entram
nas specs 003/004).

## Technical Context

**Language/Version**: TypeScript 5.x (strict) sobre Node.js 24 LTS (pinado via `.tool-versions`/`engines`); pnpm 11 via `packageManager` (corepack)
**Primary Dependencies**: Turborepo (`turbo`), ESLint 9 (flat config) + `typescript-eslint`, Prettier, Husky 9, lint-staged, commitlint (`@commitlint/{cli,config-conventional}`)
**Storage**: N/A (feature de tooling; nenhum dado persistido)
**Testing**: Vitest (runner padrão do monorepo, Princípio VIII); nesta fase apenas um smoke test em `packages/shared` para provar que `turbo run test` passa verde
**Target Platform**: Ambiente de desenvolvimento local (Linux/macOS); Node 24 LTS
**Project Type**: Monorepo (workspaces) — apenas `packages/*` nesta spec; `apps/*` fora de escopo
**Performance Goals**: Pipeline (`build|lint|typecheck|test`) — cache frio < 3 min, cache quente < 30 s (SC-005). Bootstrap (install + primeiro pipeline) < 5 min (SC-001)
**Constraints**: Nenhum app de produto presente; todos os 4 comandos devem sair com exit 0 mesmo vazios; auditoria bloqueia em vuln crítica/alta (FR-011); sem cache remoto; sem CI
**Scale/Scope**: 2 pacotes iniciais (`eslint-config`, `shared`) + config raiz; extensível a N pacotes sem edição da config raiz (FR-010)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **SDD (I):** `spec.md` com critérios de aceite e user stories P1/P2/P3 definidas; clarificações resolvidas
- [x] **Abstração de Runtime (II):** Nenhum import de AWS SDK planejado. `packages/shared` é sem efeitos colaterais e não toca runtime; nenhuma exceção necessária
- [x] **Streaming-First (III):** N/A — a feature não expõe dados em tempo real; nenhum endpoint SSE requerido nesta spec
- [x] **UI-First no Storybook (IV):** N/A — nenhum componente de UI é entregue nesta spec (Storybook é spec 004). Nenhuma story requerida
- [x] **UX Workflow-First (V):** N/A — sem superfície de UI/navegação nesta spec
- [x] **TypeScript Strict (VI):** Núcleo da feature — strict habilitado no `tsconfig` base compartilhado; ESLint + Prettier + Husky + Conventional Commits são exatamente o que esta spec instala
- [x] **Testes de Componente (VII):** N/A — sem componentes de UI. Reavaliar quando `packages/ui` existir (spec futura)
- [x] **Testes de Integração (VIII):** N/A para Route Handlers (não existem ainda). Vitest é configurado como runner base para que specs futuras cumpram o Princípio VIII sem re-setup

**Resultado do gate**: PASS. Nenhuma violação. Os princípios de UI/SSE/testes-de-componente são
inaplicáveis por escopo (feature puramente de tooling fundacional) — não diluídos. A
Complexity Tracking abaixo permanece vazia.

## Project Structure

### Documentation (this feature)

```text
specs/001-monorepo-foundation/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — decisões técnicas
├── data-model.md        # Phase 1 — entidades de configuração
├── quickstart.md        # Phase 1 — como validar a feature
├── contracts/           # Phase 1 — contratos de pipeline e config compartilhada
│   ├── pipeline-tasks.md
│   └── shared-config.md
└── checklists/
    └── requirements.md  # Checklist de qualidade da spec (Phase 1.3)
```

### Source Code (repository root)

```text
/                              # raiz do monorepo
├── package.json               # workspace root: scripts de pipeline, packageManager, engines, devDeps de tooling
├── pnpm-workspace.yaml        # globs de workspace: packages/*, apps/*
├── turbo.json                 # grafo de tarefas: build, lint, typecheck, test, audit
├── eslint.config.js           # config ESLint raiz (governa arquivos de config na raiz)
├── .tool-versions             # Node 24 LTS pinado (asdf)
├── .npmrc                     # config pnpm
├── .prettierrc.json           # config Prettier
├── commitlint.config.js       # Conventional Commits
├── .husky/
│   ├── pre-commit             # roda lint-staged
│   └── commit-msg             # roda commitlint
├── packages/
│   ├── eslint-config/         # config ESLint flat + tsconfig base compartilhados
│   │   ├── package.json       # exports: ./base (eslint), ./tsconfig (tsconfig.base.json)
│   │   ├── base.js            # ESLint flat config compartilhada
│   │   ├── tsconfig.base.json # compilerOptions strict compartilhadas
│   │   └── README.md
│   └── shared/                # tipos/utilitários base, sem side effects
│       ├── package.json
│       ├── tsconfig.json      # estende ../eslint-config/tsconfig.base.json
│       ├── eslint.config.js   # estende @ministack/eslint-config/base
│       ├── vitest.config.ts
│       └── src/
│           ├── index.ts       # barrel de exports (tipos/utilitários)
│           ├── types.ts       # tipos base compartilhados
│           └── index.test.ts  # smoke test (prova que `turbo run test` é verde)
└── apps/                      # produto entra nas specs 003/004 (fora de escopo)
```

**Structure Decision**: Monorepo com workspaces pnpm. Config compartilhada centralizada em
`packages/eslint-config` (ESLint flat + tsconfig base) consumida por extensão. `packages/shared`
é o primeiro consumidor real dessa config e valida ponta-a-ponta que um novo pacote herda strict

- lint sem setup adicional (US2). O grafo do Turborepo descobre pacotes automaticamente via
  `pnpm-workspace.yaml`, satisfazendo FR-010 sem edição da raiz ao adicionar pacotes.

## Complexity Tracking

> Nenhuma violação de Constituição a justificar. Seção intencionalmente vazia.
