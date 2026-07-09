# Tasks: Monorepo Foundation

**Input**: Design documents from `/specs/001-monorepo-foundation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Esta é uma spec de tooling — sem componentes de UI (Princípio VII N/A) e sem Route
Handlers (Princípio VIII N/A nesta fase). Um único smoke test em `packages/shared` é incluído
para provar que `turbo run test` é verde e estabelecer Vitest como runner base.

**Organization**: Tarefas agrupadas por user story (P1 → P2 → P3), cada uma testável de forma
independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependências pendentes)
- **[Story]**: US1 / US2 / US3

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Esqueleto do workspace e toolchain pinado.

- [x] T001 Criar `.tool-versions` (Node 24 LTS) e `.npmrc` (`engine-strict=true`, `auto-install-peers=true`) na raiz
- [x] T002 Criar `package.json` raiz (privado): campo `packageManager` (pnpm), `engines.node`, scripts de pipeline (`build|lint|typecheck|test|audit|ci`), devDeps de tooling (turbo, eslint, prettier, husky, lint-staged, commitlint, typescript, vitest)
- [x] T003 Criar `pnpm-workspace.yaml` com globs `packages/*` e `apps/*`
- [x] T004 [P] Criar `.gitignore` cobrindo `node_modules/`, `dist/`, `.turbo/`, `*.log`, `.env*`, `coverage/`
- [x] T005 [P] Criar `.prettierrc.json` e `.prettierignore` na raiz

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Config compartilhada e grafo do pipeline — bloqueia todas as user stories.

**⚠️ CRITICAL**: Nenhuma user story pode ser concluída antes desta fase.

- [x] T006 Criar `turbo.json` com tarefas `build`, `lint`, `typecheck`, `test` (cache) e `audit` (`cache: false`), com `dependsOn` conforme contracts/pipeline-tasks.md
- [x] T007 Criar pacote `packages/eslint-config`: `package.json` com `name` `@ministack/eslint-config` e `exports` `./base` e `./tsconfig`
- [x] T008 [P] Implementar `packages/eslint-config/base.js` (ESLint 9 flat: `@eslint/js` + `typescript-eslint` type-checked + `eslint-config-prettier`)
- [x] T009 [P] Implementar `packages/eslint-config/tsconfig.base.json` (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `isolatedModules`, `moduleResolution: bundler`)
- [x] T010 [P] Criar `packages/eslint-config/README.md` documentando os exports e o uso por extensão

**Checkpoint**: Config compartilhada e pipeline prontos — user stories podem começar.

---

## Phase 3: User Story 1 - Ambiente local funcional em um comando (Priority: P1) 🎯 MVP

**Goal**: `pnpm install` + `turbo run build|lint|typecheck|test` verdes a partir da raiz em checkout limpo.

**Independent Test**: Clone limpo → `pnpm install` → `pnpm run ci` retorna exit 0.

- [x] T011 [US1] Configurar script raiz `ci` agregando `audit → build → lint → typecheck → test` no `package.json` raiz (fecha o contrato do pipeline)
- [x] T012 [US1] Rodar `pnpm install` e verificar que os 4 comandos (`build|lint|typecheck|test`) saem com exit 0 mesmo sem pacotes de produto (FR-005; edge case test-vazio)
- [x] T013 [US1] Validar descoberta automática: confirmar que o grafo do Turborepo enxerga os pacotes via globs sem edição da raiz (FR-010)

**Checkpoint**: US1 funcional e testável de forma independente (MVP).

---

## Phase 4: User Story 2 - Regras de qualidade compartilhadas (Priority: P2)

**Goal**: Qualquer pacote herda ESLint + TypeScript strict só estendendo a config base.

**Independent Test**: Pacote que estende a base + código que viola strict/lint ⇒ `typecheck`/`lint` falham apontando o erro.

- [x] T014 [P] [US2] Criar `packages/shared/package.json` (`@ministack/shared`, `type: module`, scripts `build|lint|typecheck|test`, dep dev em `@ministack/eslint-config` via `workspace:*`)
- [x] T015 [P] [US2] Criar `packages/shared/tsconfig.json` estendendo `@ministack/eslint-config/tsconfig`
- [x] T016 [P] [US2] Criar `packages/shared/eslint.config.js` estendendo `@ministack/eslint-config/base`
- [x] T017 [US2] Implementar `packages/shared/src/types.ts` e `packages/shared/src/index.ts` (barrel) com tipos base, sem efeitos colaterais (FR-003, Princípio II)
- [x] T018 [US2] Verificar herança da config: introduzir temporariamente `any` implícito ⇒ `turbo run typecheck` falha; introduzir violação de lint ⇒ `turbo run lint` falha; reverter (Acceptance US2 #1, #2, SC-004)
- [x] T019 [US2] Verificar resolução `workspace:*` de `@ministack/shared` a partir de outro pacote sem build manual (Acceptance US2 #3)

**Checkpoint**: US1 e US2 funcionam de forma independente.

---

## Phase 5: User Story 3 - Qualidade garantida antes do commit (Priority: P3)

**Goal**: pre-commit roda lint-staged e commit-msg valida Conventional Commits.

**Independent Test**: Commit com lint quebrado e mensagem inválida são rejeitados localmente.

- [x] T020 [US3] Adicionar script `prepare` (husky) ao `package.json` raiz para instalar hooks no `pnpm install` (FR-006)
- [x] T021 [P] [US3] Criar `.husky/pre-commit` executando `pnpm exec lint-staged`
- [x] T022 [P] [US3] Criar `.husky/commit-msg` executando `pnpm exec commitlint --edit "$1"`
- [x] T023 [P] [US3] Criar `commitlint.config.js` estendendo `@commitlint/config-conventional`
- [x] T024 [P] [US3] Adicionar bloco `lint-staged` (ESLint `--fix` + Prettier nos arquivos staged) ao `package.json` raiz
- [x] T025 [US3] Verificar hooks: mensagem `"fix stuff"` rejeitada; `"feat: ..."` aceita; staged com lint autofixável corrigido (Acceptance US3 #1, #2, #3; edge case sem staged = no-op)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T026 [P] Implementar `packages/shared/src/index.test.ts` (Vitest smoke test) e `packages/shared/vitest.config.ts` — prova que `turbo run test` é verde (D8)
- [x] T027 Configurar tarefa/atalho `audit` (`pnpm audit --audit-level=high`) e `pnpm.auditConfig.ignoreCves` (allowlist rastreável) no `package.json` raiz (FR-011, SC-006, edge case vuln-sem-fix)
- [x] T028 Medir performance do pipeline: cache frio < 3 min e cache quente < 30 s (SC-005); registrar no PR
- [x] T029 [P] Rodar `pnpm run ci` completo e a validação do quickstart.md ponta-a-ponta (SC-001, SC-002)

---

## Dependencies & Execution Order

- **Setup (P1: T001–T005)**: sem dependências.
- **Foundational (P2: T006–T010)**: depende do Setup; BLOQUEIA todas as user stories.
- **US1 (P3: T011–T013)**: depende da Foundational. MVP.
- **US2 (P4: T014–T019)**: depende da Foundational (consome `packages/eslint-config`).
- **US3 (P5: T020–T025)**: depende do Setup/Foundational (scripts raiz + devDeps).
- **Polish (P6: T026–T029)**: depende das user stories relevantes.

### Parallel Opportunities

- T004, T005 em paralelo (arquivos distintos).
- T008, T009, T010 em paralelo (arquivos distintos dentro de `eslint-config`).
- T014, T015, T016 em paralelo; T021–T024 em paralelo.
- US2 e US3 podem ser desenvolvidas em paralelo após a Foundational.

## Implementation Strategy

- **MVP**: Setup + Foundational + US1 ⇒ monorepo com pipeline verde a partir da raiz.
- **Incremental**: +US2 (config compartilhada validada) → +US3 (guardrails de commit) → Polish
  (smoke test, auditoria, medição de performance).

## Notes

- Nenhum AWS SDK, nenhum componente de UI, nenhum endpoint SSE nesta spec (verificado no plano).
- Ordem de UI (story-first) e de SSE (contrato→handler→teste→frontend) não se aplicam — sem UI/SSE.
- Commit após cada fase lógica; nunca `git add .`/`-A`; nunca commitar em `main`.
