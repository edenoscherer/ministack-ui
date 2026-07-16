# Arquitetura de Desenvolvimento — Spec Kit + Next.js + Storybook + Monorepo

## Visão Geral

Plataforma open-source/self-hosted para observabilidade local, debugging distribuído e runtime
inspection, com foco em developer experience. Compatível com MiniStack, LocalStack e AWS real
(futuro).

**Não é** um clone do AWS Console nem um CRUD explorer genérico. **É** um runtime inspector com
workflow-first UX e dados em tempo real via SSE.

> **Nota de migração**: a fundação do monorepo e as primeiras features (log streaming, descoberta
> de log groups/streams) foram construídas via **OpenSpec** (ver `openspec/specs/` e
> `openspec/changes/archive/`). A partir desta ratificação, toda feature nova segue **Spec Kit**
> (`specs/[feature]/`, `.specify/`). O histórico OpenSpec permanece como registro, não é
> reescrito retroativamente — ver `.specify/memory/constitution.md`, Princípio I.

---

## Stack Oficial

| Camada          | Tecnologia                |
| --------------- | ------------------------- |
| Monorepo        | Turborepo + pnpm          |
| Frontend        | Next.js 15 (App Router)   |
| UI              | Tailwind + shadcn/ui      |
| Estado          | TanStack Query + Zustand  |
| Backend/API     | Next.js Route Handlers    |
| Runtime SDK     | AWS SDK v3                |
| Realtime        | SSE                       |
| Componentes UI  | Storybook                 |
| SDD (novo)      | Spec Kit                  |
| SDD (histórico) | OpenSpec                  |
| Arquitetura     | ADR                       |
| Docs            | Nextra                    |
| Package Manager | pnpm                      |
| Qualidade       | ESLint + Prettier + Husky |

---

## Filosofia

### Arquitetural

| Não criar              | Criar                  |
| ---------------------- | ---------------------- |
| Clone AWS Console      | Runtime inspector      |
| CRUD explorer genérico | Distributed debugging  |
| Painel administrativo  | Realtime observability |
|                        | Workflow-first UX      |

### Spec-Driven Development (SDD)

Toda implementação **nova** nasce de uma spec. Código **não** é source of truth — specs são.

Fluxo obrigatório por feature nova:

1. **Constitution** — princípios e restrições do projeto
2. **Specify** — requisitos e histórias de usuário
3. **Clarify** — validação de pontos ambíguos
4. **Plan** — plano técnico, data model e contratos
5. **Tasks** — breakdown acionável de implementação
6. **Implement** — execução guiada pelas specs

### UI

- **Workflow-first:** `Logs → Event → Debugging`, não `Resources → CRUD`
- **Navegação rasa:** máximo 2 níveis de profundidade
- **Busca global:** todo recurso é pesquisável
- **Correlation-first:** IDs são navegáveis entre serviços
- **Streaming-first:** zero refresh manual, tudo via SSE

---

## Estrutura do Monorepo

```txt
root/
│
├── .specify/
│   └── memory/
│       └── constitution.md        ← princípios e restrições do projeto (features novas)
│
├── openspec/                      ← histórico pré-Spec-Kit (fundação, logs realtime, log groups)
│   ├── specs/                     ← specs vigentes migradas do OpenSpec
│   └── changes/archive/           ← changes já implementadas e arquivadas
│
├── apps/
│   ├── web/                       ← aplicação principal (Next.js 15)
│   ├── docs/                      ← documentação pública (Nextra)
│   └── storybook/                 ← desenvolvimento isolado de UI
│
├── packages/
│   ├── ui/                        ← componentes reutilizáveis
│   ├── runtime-sdk/               ← abstração MiniStack / LocalStack / AWS
│   ├── log-engine/                ← parsing, correlation, filtering, formatting
│   ├── event-engine/              ← tracing, replay, timeline, payload linking
│   ├── shared/                    ← tipos e utilitários compartilhados
│   └── eslint-config/             ← configuração ESLint compartilhada
│
├── specs/                         ← features novas (Spec Kit)
│   └── [feature-name]/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── data-model.md
│       ├── research.md
│       └── contracts/
│
├── adr/                           ← Architecture Decision Records
├── scripts/
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Aplicações

### apps/web

Aplicação principal. Nunca acessa AWS diretamente — toda comunicação passa pelos Route Handlers.

```txt
app/
components/
hooks/
services/
providers/
store/
styles/
```

Rotas já implementadas: `/` (home), `/logs` (log streaming + descoberta de log groups/streams).

### apps/storybook

Desenvolvimento isolado da UI. Todo componente crítico nasce aqui antes de ir para `apps/web`.

Objetivos: validar UX · testar componentes · manter design system · evitar regressões

Stories existentes: `Button`, `JsonTree`, `LogViewer`, `MiniLineChart`, `ServiceIcon`,
`StatusBadge`. Pendentes (dívida técnica): `EventTimeline`, `QueueCard`.

### apps/docs

Documentação pública via Nextra.

---

## Packages

### packages/ui

Componentes reutilizáveis consumidos por `apps/web` e `apps/storybook`.

Já implementados: `Button` · `LogViewer` · `JsonTree` · `EventTimeline` · `QueueCard` ·
`MiniLineChart` · `StatusBadge` · `ServiceIcon`.

> O visualizador de JSON chama-se `JsonTree` (não `JsonViewer`) — use esse nome em specs, docs e
> código novo.

### packages/runtime-sdk

Abstração de runtimes. Permite trocar MiniStack por LocalStack ou AWS sem alterar a UI.

```ts
interface RuntimeProvider {
  logs(): Promise<void>; // stub — não implementado ainda
  queues(): Promise<void>; // stub — não implementado ainda
  topics(): Promise<void>; // stub — não implementado ainda
  secrets(): Promise<void>; // stub — não implementado ainda
  streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void>;
  getLogGroups(): Promise<string[]>;
  getLogStreams(logGroup: string): Promise<string[]>;
}
```

Providers: `MiniStackProvider` · `LocalStackProvider` · `AwsProvider`. `getLogGroups`,
`getLogStreams` e `streamLogs` já têm implementação (com dados mockados em `MiniStackProvider`
via `mockHelper`). `logs()`, `queues()`, `topics()` e `secrets()` são placeholders que lançam
`not implemented` — nenhuma feature de fila/tópico/secret real existe ainda. Toda spec nova que
precisar de um desses recursos DEVE estender esta interface e implementá-la nos três providers
antes de qualquer Route Handler consumi-la (Princípio II).

### packages/log-engine

Processamento de logs: parsing · correlation · filtering · formatting

### packages/event-engine

Fluxo distribuído: event tracing · replay · timeline · payload linking

---

## Arquitetura Backend

### Fluxo de dados

```txt
Frontend (Next.js)
       ↓
Route Handlers
       ↓
Runtime SDK
       ↓
MiniStack / LocalStack / AWS
```

> **Regra:** Frontend nunca importa AWS SDK diretamente.

Route Handlers já implementados: `GET /api/logs/groups`, `GET /api/logs/streams`,
`GET /api/logs/stream` (SSE).

### SSE (Realtime)

```txt
Browser → SSE endpoint → Runtime stream
```

Features obrigatórias: reconnect · heartbeat · pause · auto-scroll

---

## Spec Kit Workflow (features novas)

### Fases e comandos

| #   | Fase         | Comando                 | Output                                                     |
| --- | ------------ | ----------------------- | ---------------------------------------------------------- |
| 1   | Constitution | `/speckit.constitution` | `.specify/memory/constitution.md`                          |
| 2   | Specify      | `/speckit.specify`      | `specs/[feature]/spec.md`                                  |
| 3   | Clarify      | `/speckit.clarify`      | —                                                          |
| 4   | Plan         | `/speckit.plan`         | `plan.md` · `data-model.md` · `research.md` · `contracts/` |
| 5   | Tasks        | `/speckit.tasks`        | `specs/[feature]/tasks.md`                                 |
| 6   | Implement    | `/speckit.implement`    | —                                                          |

### Estrutura de artefatos por feature

```txt
specs/[feature-name]/
├── spec.md        ← /speckit.specify
├── plan.md        ← /speckit.plan
├── tasks.md       ← /speckit.tasks
├── data-model.md  ← /speckit.plan
├── research.md    ← /speckit.plan
└── contracts/     ← /speckit.plan
```

> **Regra:** Nenhuma feature nova começa sem `spec.md`, `plan.md` e `tasks.md` com critérios de
> aceite definidos.

---

## ADR Workflow

```txt
adr/
  ADR-001-nextjs.md
  ADR-002-sse.md
```

### Template ADR

```md
# ADR-001 — Título

## Status

Accepted

## Contexto

## Decisão

## Consequências

## Alternativas consideradas
```

---

## Storybook Strategy

Toda UI crítica deve nascer no Storybook. Componentes devem:

- Funcionar isoladamente (sem `apps/web`)
- Possuir mock data própria
- Cobrir loading state e error state

### Componentes obrigatórios

| Componente       | Obrigatório | Status                        |
| ---------------- | ----------- | ----------------------------- |
| LogViewer        | sim         | ✅ implementado + story       |
| JsonTree         | sim         | ✅ implementado + story       |
| EventTimeline    | sim         | ⚠️ implementado, sem story    |
| QueueCard        | sim         | ⚠️ implementado, sem story    |
| QueueReplayModal | sim         | ❌ pendente (spec DLQ replay) |

---

## Docker

Dois profiles para setup local em menos de 2 minutos:

```txt
docker-compose.ministack.yml    ← caminho principal
docker-compose.localstack.yml   ← exemplo/comparação e testes
```

---

## Developer Workflow (feature nova)

| Passo | Ação                        | Output                                     |
| ----- | --------------------------- | ------------------------------------------ |
| 1     | `/speckit.constitution`     | `.specify/memory/constitution.md`          |
| 2     | `/speckit.specify`          | `specs/[feature]/spec.md`                  |
| 3     | `/speckit.clarify`          | —                                          |
| 4     | `/speckit.plan`             | `plan.md` · `data-model.md` · `contracts/` |
| 5     | `/speckit.tasks`            | `specs/[feature]/tasks.md`                 |
| 6     | `/speckit.implement`        | código                                     |
| 7     | Criar stories no Storybook  | `[Component].stories.tsx`                  |
| 8     | Validar critérios de aceite | —                                          |

---

## Estado do Produto

Ver [`roadmap.md`](./roadmap.md) para o roadmap completo (legado OpenSpec + specs Spec Kit
novas) e [`PROGRESS.md`](./PROGRESS.md) para o progresso detalhado.

Resumo: fundação do monorepo, packages base (`ui`, `runtime-sdk`, `log-engine`, `event-engine`,
`shared`, `eslint-config`), `apps/web`/`apps/storybook`/`apps/docs`, streaming de logs via SSE e
descoberta de log groups/streams já estão implementados (OpenSpec). Secrets Manager, S3, SQS
(browser + DLQ replay) e SNS (tópicos + event timeline) ainda não foram iniciados.

---

## Quality Rules

### Obrigatório

- TypeScript strict
- ESLint + Prettier
- Husky (pre-commit hooks)
- Conventional commits
- Interaction tests (Storybook `@storybook/test`) para os componentes obrigatórios
- Testes de integração (Vitest) para Route Handlers críticos, usando `MiniStackProvider`

### Não permitido

- AWS SDK no frontend
- Lógica de runtime dentro de componentes React
- Componentes sem story no Storybook
- Feature nova sem `spec.md`, `plan.md` e `tasks.md` (via Spec Kit)

---

## Objetivo Final

Criar a melhor experiência open-source para debugging local de sistemas distribuídos AWS-compatible.
