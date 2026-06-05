# Arquitetura de Desenvolvimento — Spec Kit + Next.js + Storybook + Monorepo

## Visão Geral

Plataforma open-source/self-hosted para observabilidade local, debugging distribuído e runtime inspection, com foco em developer experience. Compatível com MiniStack, LocalStack e AWS real (futuro).

**Não é** um clone do AWS Console nem um CRUD explorer genérico. **É** um runtime inspector com workflow-first UX e dados em tempo real via SSE.

---

## Stack Oficial

| Camada          | Tecnologia                |
| --------------- | ------------------------- |
| Monorepo        | Turborepo                 |
| Frontend        | Next.js 15                |
| UI              | Tailwind + shadcn/ui      |
| Estado          | TanStack Query + Zustand  |
| Backend/API     | Next.js Route Handlers    |
| Runtime SDK     | AWS SDK v3                |
| Realtime        | SSE                       |
| Componentes UI  | Storybook                 |
| SDD             | Spec Kit                  |
| Arquitetura     | ADR                       |
| Docs            | Nextra                    |
| Package Manager | pnpm                      |
| Qualidade       | ESLint + Prettier + Husky |

---

## Filosofia

### Arquitetural

| Não criar | Criar |
| --------- | ----- |
| Clone AWS Console | Runtime inspector |
| CRUD explorer genérico | Distributed debugging |
| Painel administrativo | Realtime observability |
| | Workflow-first UX |

### Spec-Driven Development (SDD)

Toda implementação nasce de uma spec. Código **não** é source of truth — specs são.

Fluxo obrigatório por feature:

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
│       └── constitution.md        ← princípios e restrições do projeto
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
├── specs/
│   └── [feature-name]/            ← uma pasta por feature
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── data-model.md
│       ├── research.md
│       └── contracts/
│
├── adr/                           ← Architecture Decision Records
├── flows/                         ← diagramas de fluxo funcional (SNS→SQS, logs correlation etc.)
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

### apps/storybook

Desenvolvimento isolado da UI. Todo componente crítico nasce aqui antes de ir para `apps/web`.

Objetivos: validar UX · testar componentes · manter design system · evitar regressões

### apps/docs

Documentação pública via Nextra.

---

## Packages

### packages/ui

Componentes reutilizáveis consumidos por `apps/web` e `apps/storybook`.

Exemplos: `Button` · `LogViewer` · `JsonTree` · `EventTimeline` · `QueueCard`

### packages/runtime-sdk

Abstração de runtimes. Permite trocar MiniStack por LocalStack ou AWS sem alterar a UI.

```ts
interface RuntimeProvider {
  logs(): Promise<void>;
  queues(): Promise<void>;
  topics(): Promise<void>;
  secrets(): Promise<void>;
}
```

Providers: `MiniStackProvider` · `LocalStackProvider` · `AwsProvider`

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

### SSE (Realtime)

```txt
Browser → SSE endpoint → Runtime stream
```

Features obrigatórias: reconnect · heartbeat · pause · auto-scroll

---

## Spec Kit Workflow

### Fases e comandos

| # | Fase | Comando | Output |
|---|------|---------|--------|
| 1 | Constitution | `/speckit.constitution` | `.specify/memory/constitution.md` |
| 2 | Specify | `/speckit.specify` | `specs/[feature]/spec.md` |
| 3 | Clarify | `/speckit.clarify` | — |
| 4 | Plan | `/speckit.plan` | `plan.md` · `data-model.md` · `research.md` · `contracts/` |
| 5 | Tasks | `/speckit.tasks` | `specs/[feature]/tasks.md` |
| 6 | Implement | `/speckit.implement` | — |

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

### Template: spec.md

```md
# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`
**Created**: [DATE]
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### Edge Cases

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST [specific capability]
- **FR-002**: System MUST [specific capability]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes]

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: [Measurable metric]
- **SC-002**: [Measurable metric]

## Assumptions

- [Assumption about target users]
- [Assumption about scope boundaries]
- [Dependency on existing system/service]
```

> **Regra:** Nenhuma feature começa sem `spec.md`, `plan.md` e `tasks.md` com critérios de aceite definidos.

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

| Componente       | Obrigatório |
| ---------------- | ----------- |
| LogViewer        | sim         |
| JsonViewer       | sim         |
| EventTimeline    | sim         |
| QueueReplayModal | sim         |
| RuntimeStatus    | sim         |

---

## Docker

Dois profiles para setup local em menos de 2 minutos:

```txt
docker-compose.ministack.yml
docker-compose.localstack.yml
```

---

## Developer Workflow

| Passo | Ação | Output |
| ----- | ---- | ------ |
| 1 | `/speckit.constitution` | `.specify/memory/constitution.md` |
| 2 | `/speckit.specify` | `specs/[feature]/spec.md` |
| 3 | `/speckit.clarify` | — |
| 4 | `/speckit.plan` | `plan.md` · `data-model.md` · `contracts/` |
| 5 | `/speckit.tasks` | `specs/[feature]/tasks.md` |
| 6 | `/speckit.implement` | código |
| 7 | Criar stories no Storybook | `[Component].stories.tsx` |
| 8 | Validar critérios de aceite | — |

---

## Roadmap

| Sprint | Tema | Entregas |
| ------ | ---- | -------- |
| 1 | Fundação | monorepo · Spec Kit · Storybook · runtime-sdk · Next.js app |
| 2 | Logs realtime | SSE · parser · filters · JSON viewer |
| 3 | Queue debugging | SQS · replay · DLQ · payload explorer |
| 4 | SNS flow | publish · subscribers · event timeline |
| 5 | Secrets + S3 | secrets CRUD · bucket explorer · previews |

---

## Quality Rules

### Obrigatório

- TypeScript strict
- ESLint + Prettier
- Husky (pre-commit hooks)
- Conventional commits

### Não permitido

- AWS SDK no frontend
- Lógica de runtime dentro de componentes React
- Componentes sem story no Storybook
- Feature sem `spec.md`, `plan.md` e `tasks.md` (via Spec Kit)

---

## Objetivo Final

Criar a melhor experiência open-source para debugging local de sistemas distribuídos AWS-compatible.
