# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Open-source platform for local observability, distributed debugging and runtime inspection of AWS-compatible systems (MiniStack, LocalStack, AWS). It is a **runtime inspector with workflow-first UX**, not an AWS Console clone or generic CRUD explorer. See `docs/doc.md` for the full architecture reference, `docs/roadmap.md` for the 14-spec delivery plan, and `docs/PROGRESS.md` for live status per spec.

## Current State

**Spec `001-monorepo-foundation` is implemented.** The monorepo is bootstrapped: root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `packages/eslint-config` (shared ESLint flat config + strict `tsconfig` base) and `packages/shared` (side-effect-free base types) exist, with Husky + lint-staged + commitlint hooks and a `build|lint|typecheck|test` pipeline plus a blocking `pnpm audit`. Node is pinned to 24 via `.tool-versions`/`engines`. `apps/` does not exist yet (arrives with spec `003`). Check `docs/PROGRESS.md` and `git branch` for what else is in flight; the branch name (`00N-feature-name`) tells you which spec is active.

## Commands

All commands run via pnpm + Turborepo from the repo root:

```bash
pnpm install               # install all workspace dependencies
turbo run build            # build all apps and packages
turbo run lint             # lint all workspaces
turbo run typecheck        # typecheck all workspaces
turbo run test             # run all tests
turbo run dev              # start apps/web + apps/storybook in watch mode

# target a single workspace
pnpm --filter @ministack/web dev
pnpm --filter @ministack/ui storybook
```

## SDD Workflow (mandatory)

No feature may be implemented without completing the Spec Kit phases first — see Constitution Principle I. Skills are invocable as `/speckit-<name>` (hyphenated); `/speckit.<name>` also works. Each phase has git auto-commit hooks configured in `.specify/extensions.yml`.

| #   | Phase        | Skill command           | Output                                                  |
| --- | ------------ | ----------------------- | ------------------------------------------------------- |
| 1   | Constitution | `/speckit-constitution` | `.specify/memory/constitution.md`                       |
| 2   | Specify      | `/speckit-specify`      | `specs/[feature]/spec.md`                               |
| 3   | Clarify      | `/speckit-clarify`      | ambiguities resolved in `spec.md`                       |
| 4   | Checklist    | `/speckit-checklist`    | requirement-completeness gaps closed                    |
| 5   | Plan         | `/speckit-plan`         | `plan.md`, `data-model.md`, `research.md`, `contracts/` |
| 6   | Tasks        | `/speckit-tasks`        | `specs/[feature]/tasks.md`                              |
| 7   | Analyze      | `/speckit-analyze`      | spec/plan/tasks consistency validated                   |
| 8   | Implement    | `/speckit-implement`    | code + stories + tests                                  |

Templates live in `.specify/templates/`. Each feature gets its own folder under `specs/[feature-name]/`. `.specify/feature.json` tracks the active `feature_directory` for orchestration.

Two subagents encode this workflow for this repo specifically:

- **`full-cycle`** — runs the entire spec → PR cycle autonomously (invoke with a feature description or spec number)
- **`tech-lead`** — reviews code/specs against the Constitution's 8 principles; use for architectural decisions or PR review

## Architecture

### Data flow

```
apps/web (Next.js 15)
    ↓
apps/web/app/api/* (Route Handlers)
    ↓
packages/runtime-sdk (RuntimeProvider interface)
    ↓
MiniStack / LocalStack / AWS
```

Frontend **never** imports AWS SDK directly — all AWS calls go through Route Handlers → `runtime-sdk`.

### Runtime abstraction

`packages/runtime-sdk` exports a single `RuntimeProvider` interface (`logGroups`, `logStreams`, `streamLogs`, `queues`, `topics`, `secrets`, `buckets`) with three interchangeable implementations:

- `MiniStackProvider` — primary dev/test runtime, backed by `docker-compose.ministack.yml` (< 2 min setup)
- `LocalStackProvider` — example/compatibility runtime, isolated container/network via `docker-compose.localstack.yml`, not the primary dev path
- `AwsProvider`

Switching runtimes requires changing only the provider — UI is unaffected.

### Realtime (SSE)

Log streaming flows: `Browser → SSE endpoint → Runtime stream`. Every SSE endpoint must implement reconnect, heartbeat, pause and auto-scroll. Polling is never a substitute for streaming.

### Packages boundary

- `packages/ui` — presentational components only, no runtime/SDK imports (cannot import `packages/runtime-sdk`)
- `packages/runtime-sdk` — exposes only `RuntimeProvider` and its implementations; only layer allowed to use AWS SDK v3
- `packages/log-engine` — log parsing, correlation, filtering, formatting
- `packages/event-engine` — event tracing, replay, timeline, payload linking
- `packages/shared` — shared types and utilities, no side effects
- `packages/eslint-config` — shared strict TypeScript/ESLint rules consumed by every workspace

## UI Rules

- Every UI component must have a Storybook `.stories.tsx` before being used in `apps/web`; stories cover default, loading, and error states, each with its own mock data
- These components are permanently mandatory in Storybook, each with `@storybook/test` interaction tests: `LogViewer`, `JsonViewer`, `EventTimeline`, `QueueReplayModal`, `RuntimeStatus`, `LogGroupCard`, `QueueCard`
- Navigation depth: maximum 2 levels; every resource is reachable via global search; correlation IDs are clickable/navigable across services
- No manual refresh — everything streams via SSE
- Route Handlers that talk to `runtime-sdk` need Vitest integration tests using `MiniStackProvider` as the default test runtime

## Constraints

- No AWS SDK in frontend packages or components; no runtime logic inside React components — extract to `services/` or `packages/`
- Stack choices (Turborepo, Next.js 15, Tailwind + shadcn/ui, TanStack Query + Zustand, Vitest, Nextra) are fixed per `.specify/memory/constitution.md` — changing any requires an ADR in `adr/` first
- Conventional commits required (enforced by Husky); never `git add -A`/`git add .` — stage files explicitly; never commit directly to `main`
- `docs/ministack-ui-export/` is a gitignored Lovable-exported UI prototype (TanStack Start/Vite/React 19 stack — **not** Next.js). Treat it only as a visual/UX reference for component ideas, never as source to port directly; the real stack is defined by the Constitution.

## Active Technologies

- TypeScript 5.x (strict) sobre Node.js 24 LTS (pinado via `.tool-versions`/`engines`); pnpm 11 via `packageManager` (corepack) + Turborepo (`turbo`), ESLint 9 (flat config) + `typescript-eslint`, Prettier, Husky 9, lint-staged, commitlint (`@commitlint/{cli,config-conventional}`) (001-monorepo-foundation)
- N/A (feature de tooling; nenhum dado persistido) (001-monorepo-foundation)

## Recent Changes

- 001-monorepo-foundation: Added TypeScript 5.x (strict) sobre Node.js 24 LTS (pinado via `.tool-versions`/`engines`); pnpm 11 via `packageManager` (corepack) + Turborepo (`turbo`), ESLint 9 (flat config) + `typescript-eslint`, Prettier, Husky 9, lint-staged, commitlint (`@commitlint/{cli,config-conventional}`)
