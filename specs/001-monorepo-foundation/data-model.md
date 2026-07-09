# Data Model: Monorepo Foundation

Esta feature é de tooling — não há entidades de domínio nem persistência. As "entidades" abaixo
são artefatos de configuração e suas relações, derivados das Key Entities da spec (Workspace
Package, Pipeline Task).

## Entidade: Workspace Package

Unidade de código reconhecida pelo pnpm/Turborepo.

| Campo | Tipo | Regra / Origem |
|-------|------|----------------|
| `name` | string | Escopo `@ministack/*` (ex.: `@ministack/shared`). Único no workspace. |
| `path` | string | Sob `packages/*` ou `apps/*` (glob de `pnpm-workspace.yaml`). |
| `dependencies` | mapa | Deps internas via protocolo `workspace:*`. |
| `scripts` | mapa | Pode expor `build`, `lint`, `typecheck`, `test` — nós que o Turborepo executa. |
| `extendsConfig` | ref | `eslint.config.js` importa `@ministack/eslint-config/base`; `tsconfig.json` estende `@ministack/eslint-config/tsconfig`. |

**Regras de validação**
- Um pacote sem um dado script simplesmente não participa daquela tarefa (não é erro) — cobre o
  edge case "test sem arquivos".
- Adicionar um pacote sob os globs o torna automaticamente visível ao pipeline (FR-010); fora dos
  globs, fica fora de escopo (edge case documentado).

**Instâncias nesta spec**
- `@ministack/eslint-config` — provê config; não consome (raiz da cadeia).
- `@ministack/shared` — consome a config; primeiro pacote de produto-base.

## Entidade: Shared Config Package (`@ministack/eslint-config`)

Ponto único de verdade para políticas de qualidade.

| Export | Alvo | Consumo |
|--------|------|---------|
| `./base` | `base.js` (ESLint flat config) | `import base from '@ministack/eslint-config/base'` |
| `./tsconfig` | `tsconfig.base.json` | `{ "extends": "@ministack/eslint-config/tsconfig" }` |

**Invariantes**
- `strict: true` sempre presente na base tsconfig (FR-009).
- Consumidores podem sobrescrever regras pontualmente por composição, nunca por duplicação
  (edge case de override).

## Entidade: Pipeline Task (`turbo.json`)

| Task | `dependsOn` | `cache` | `outputs` | Requisito |
|------|-------------|---------|-----------|-----------|
| `build` | `["^build"]` | true | `dist/**` | FR-005 |
| `lint` | `[]` | true | — | FR-005, FR-002 |
| `typecheck` | `["^build"]` | true | — | FR-005, FR-009 |
| `test` | `["^build"]` | true | — | FR-005 |
| `audit` | `[]` | false | — | FR-011, SC-006 |

**Estados / transições**
- Cache MISS → executa e grava cache local (cache frio, alvo < 3 min).
- Cache HIT → replay instantâneo (cache quente, alvo < 30 s, SC-005).
- `audit` nunca cacheia: reavalia o banco de vulnerabilidades a cada execução.

## Entidade: Git Hook

| Hook | Gatilho | Ação | Requisito |
|------|---------|------|-----------|
| `pre-commit` | `git commit` | `lint-staged` (ESLint `--fix` + Prettier nos staged) | FR-007 |
| `commit-msg` | `git commit` | `commitlint --edit` (Conventional Commits) | FR-008, SC-003 |

**Regras**
- Instalados automaticamente pelo script `prepare` no `pnpm install` (FR-006).
- Sem arquivos staged → `pre-commit` é no-op, não bloqueia (edge case).
