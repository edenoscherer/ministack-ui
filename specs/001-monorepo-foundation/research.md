# Research: Monorepo Foundation

**Phase 0** — decisões técnicas fundamentadas. Todos os `NEEDS CLARIFICATION` do Technical
Context foram resolvidos abaixo. A stack (Turborepo, pnpm, ESLint, TypeScript strict, Husky,
Conventional Commits) é fixada pela Constituição ("Restrições de Stack"); a pesquisa foca em
*como* configurá-la, não em *se* adotá-la.

## D1 — Gerenciador de pacotes e workspaces

- **Decisão**: pnpm workspaces com `pnpm-workspace.yaml` (globs `packages/*`, `apps/*`), pnpm 11
  fixado via campo `packageManager` do `package.json` (ativado por corepack).
- **Rationale**: Constituição fixa pnpm. `packageManager` garante versão idêntica entre
  colaboradores sem passo manual; corepack já vem com Node. Descoberta por glob satisfaz FR-010
  (novos pacotes reconhecidos sem editar a raiz).
- **Alternativas**: npm/yarn workspaces (violam a Constituição sem ADR); listar pacotes
  manualmente no workspace (quebra FR-010).

## D2 — Orquestrador de tarefas e cache

- **Decisão**: Turborepo com `turbo.json` definindo as tarefas `build`, `lint`, `typecheck`,
  `test` e `audit`. `dependsOn: ["^build"]` onde há dependência de build; `cache: true` para
  tarefas determinísticas; `audit` marcado `cache: false`.
- **Rationale**: Cache local do Turborepo entrega a meta de cache quente < 30 s (SC-005) ao pular
  tarefas sem mudanças. `audit` não deve usar cache porque o banco de vulnerabilidades muda
  independentemente do código-fonte (SC-006/FR-011).
- **Alternativas**: scripts npm sequenciais (sem cache — falha SC-005); Nx (viola stack fixada).

## D3 — Versão de Node e reprodutibilidade

- **Decisão**: Node.js 24 LTS, pinado por `.tool-versions` (asdf) e declarado em `engines.node`
  (`>=24 <25`) com `.npmrc` `engine-strict=true`.
- **Rationale**: Assumption da spec — fixar versões durante o plano. `.tool-versions` cobre quem
  usa asdf; `engines` + `engine-strict` recusam Node incompatível em qualquer instalação,
  protegendo SC-002 (pipeline verde em checkout limpo).
- **Alternativas**: `.nvmrc` (cobre só usuários de nvm); não pinar (risco de divergência de build).

## D4 — Configuração de ESLint compartilhada

- **Decisão**: ESLint 9 flat config exportado por `packages/eslint-config` como `./base`,
  combinando `@eslint/js` recomendado + `typescript-eslint` (type-checked) + integração Prettier
  (`eslint-config-prettier`). Consumido via `import base from '@ministack/eslint-config/base'`.
- **Rationale**: Flat config é o formato atual do ESLint 9 e compõe por importação — um pacote
  estende a base e sobrescreve pontualmente (edge case da spec: regra divergente sem duplicar).
  Satisfaz FR-002 e SC-004.
- **Alternativas**: `.eslintrc` legado (deprecado no ESLint 9); duplicar config por pacote (viola
  SC-004 e o edge case de override).

## D5 — TypeScript strict compartilhado

- **Decisão**: `tsconfig.base.json` em `packages/eslint-config` com `strict: true` +
  `noUncheckedIndexedAccess`, `noImplicitOverride`, `isolatedModules`, `moduleResolution: bundler`.
  Exposto via `exports["./tsconfig"]`; cada pacote faz `"extends"` dele.
- **Rationale**: Um único ponto de verdade para strict (FR-009). Colocar o tsconfig base ao lado
  da config ESLint mantém toda a "policy de qualidade" em um pacote só.
- **Alternativas**: pacote `tsconfig` separado (overhead sem ganho neste tamanho); repetir
  `compilerOptions` por pacote (viola FR-009/SC-004).

## D6 — Git hooks: pre-commit e commit-msg

- **Decisão**: Husky 9 instalado via script `prepare` (auto no `pnpm install`, FR-006).
  `.husky/pre-commit` → `pnpm exec lint-staged`; `.husky/commit-msg` → `pnpm exec commitlint --edit`.
  lint-staged roda ESLint `--fix` + Prettier apenas nos arquivos staged.
- **Rationale**: `prepare` garante hooks sem passo manual (FR-006). lint-staged nos arquivos
  staged é rápido e autofixa (FR-007, US3 cenário 1). commitlint com
  `@commitlint/config-conventional` aplica Conventional Commits (FR-008, SC-003).
- **Alternativas**: hooks git nativos versionados à mão (frágeis); pre-commit (Python) — dependência
  extra fora da stack Node.

## D7 — Auditoria de dependências bloqueante

- **Decisão**: tarefa `audit` = `pnpm audit --audit-level=high` (falha em severidade high **ou**
  critical), exposta como script raiz e nó do `turbo.json` (`cache: false`), e encadeada no script
  agregado do pipeline. Exceções documentadas via `pnpm.auditConfig.ignoreCves` no `package.json`
  raiz, com comentário/justificativa.
- **Rationale**: `pnpm audit` é o equivalente nativo (FR-011). `--audit-level=high` bloqueia
  high+critical (SC-006). `auditConfig.ignoreCves` dá a allowlist rastreável exigida pelo edge case
  (vuln sem fix upstream), nunca silenciando globalmente.
- **Alternativas**: `npm audit` (gerenciador errado); ignorar auditoria (viola FR-011); falhar em
  qualquer nível incl. low/moderate (ruidoso; contraria o gatilho crítico/alto da clarificação).

## D8 — Test runner base

- **Decisão**: Vitest como runner do monorepo. `packages/shared` inclui um smoke test trivial para
  que `turbo run test` seja verde (não no-op vazio), estabelecendo o padrão que specs futuras
  (Princípio VIII) reutilizam.
- **Rationale**: Constituição fixa Vitest para testes de integração. Um teste real evita
  ambiguidade do edge case "test sem arquivos = sucesso" e prova a fiação do pipeline.
- **Alternativas**: nenhum teste ainda (edge case pede tratar vazio como sucesso, mas um smoke test
  dá sinal mais forte); Jest (fora da stack fixada).
