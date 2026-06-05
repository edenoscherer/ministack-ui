# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Open-source platform for local observability, distributed debugging and runtime inspection of AWS-compatible systems (MiniStack, LocalStack, AWS). See `docs/doc.md` for the full architecture reference.

## Commands

Once the monorepo is initialized (Sprint 1), all commands run via pnpm + Turborepo from the repo root:

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

No feature may be implemented without completing the Spec Kit phases first. Each phase has git auto-commit hooks configured in `.specify/extensions.yml`.

| Phase | Skill command | Output |
|-------|--------------|--------|
| Constitution | `/speckit-constitution` | `.specify/memory/constitution.md` |
| Specify | `/speckit-specify` | `specs/[feature]/spec.md` |
| Clarify | `/speckit-clarify` | — |
| Plan | `/speckit-plan` | `plan.md`, `data-model.md`, `research.md`, `contracts/` |
| Tasks | `/speckit-tasks` | `specs/[feature]/tasks.md` |
| Implement | `/speckit-implement` | — |

Templates live in `.specify/templates/`. Each feature gets its own folder under `specs/[feature-name]/`.

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

`packages/runtime-sdk` exports three providers implementing `RuntimeProvider`:
- `MiniStackProvider`
- `LocalStackProvider`
- `AwsProvider`

Switching runtimes requires changing only the provider — UI is unaffected.

### Realtime (SSE)

Log streaming flows: `Browser → SSE endpoint → Runtime stream`. SSE handlers must implement reconnect, heartbeat, pause and auto-scroll.

### Packages boundary

- `packages/ui` — presentational components only, no runtime/SDK imports
- `packages/log-engine` — log parsing, correlation, filtering, formatting
- `packages/event-engine` — event tracing, replay, timeline, payload linking
- `packages/shared` — shared types and utilities, no side effects

## UI Rules

- Every UI component must have a Storybook story before being used in `apps/web`
- Stories must cover: default, loading state, error state, with mock data
- Navigation depth: maximum 2 levels
- No manual refresh — everything streams via SSE

## Constraints

- No AWS SDK in frontend packages or components
- No runtime logic inside React components — extract to `services/` or `packages/`
- ADRs go in `adr/` using the template in `docs/doc.md`
- Conventional commits required (enforced by Husky)
