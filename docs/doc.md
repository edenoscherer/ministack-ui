# Arquitetura de Desenvolvimento — OpenSpec + Next.js + Storybook + Monorepo

# Visão Geral

Este documento define a arquitetura de desenvolvimento do projeto:

# Objetivo

Criar uma plataforma open-source/self-hosted focada em:

- observabilidade local
- debugging distribuído
- runtime inspection
- developer experience

Compatível com:

- MiniStack
- LocalStack
- AWS real (futuro)

---

# Stack Oficial

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
| SDD             | OpenSpec                  |
| Arquitetura     | ADR                       |
| Docs            | Nextra                    |
| Package Manager | pnpm                      |
| Qualidade       | ESLint + Prettier + Husky |

---

# Filosofia Arquitetural

## NÃO criar:

- clone AWS Console
- CRUD explorer genérico
- painel administrativo

## Criar:

- runtime inspector
- distributed debugging
- realtime observability
- workflow-first UX

---

# Filosofia SDD

Toda implementação deve nascer de:

1. SPEC
2. Contratos
3. Fluxo UX
4. Critérios de aceite

Código NÃO é source of truth.
Specs são.

---

# Estrutura do Monorepo

```txt id="7fcwcx"
root/
│
├── apps/
│   ├── web/
│   ├── docs/
│   └── storybook/
│
├── packages/
│   ├── ui/
│   ├── runtime-sdk/
│   ├── log-engine/
│   ├── event-engine/
│   ├── shared/
│   └── eslint-config/
│
├── specs/
│   ├── runtime/
│   ├── logs/
│   ├── queues/
│   ├── sns/
│   ├── secrets/
│   └── s3/
│
├── adr/
│
├── contracts/
│
├── flows/
│
├── scripts/
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

# Estrutura das Aplicações

---

# apps/web

## Responsabilidade

Aplicação principal.

---

## Deve conter

```txt id="lmvjlwm"
app/
components/
hooks/
services/
providers/
store/
styles/
```

---

# apps/storybook

## Responsabilidade

Desenvolvimento isolado da UI.

---

## Objetivos

- validar UX
- testar componentes
- criar design system
- evitar regressões

---

# apps/docs

## Responsabilidade

Documentação pública.

---

## Stack

Nextra.

---

# Estrutura dos Packages

---

# packages/ui

## Responsabilidade

Componentes reutilizáveis.

---

## Exemplo

```txt id="jlwm1m"
Button
LogViewer
JsonTree
EventTimeline
QueueCard
```

---

# packages/runtime-sdk

## Responsabilidade

Abstração de runtimes.

---

## Providers

```txt id="rpkjlwm"
MiniStackProvider
LocalStackProvider
AwsProvider
```

---

# Interface base

```ts id="jlwm5g"
interface RuntimeProvider {
  logs(): Promise<void>;
  queues(): Promise<void>;
  topics(): Promise<void>;
  secrets(): Promise<void>;
}
```

---

# packages/log-engine

## Responsabilidade

Processamento de logs.

---

## Features

- parsing
- correlation
- filtering
- formatting

---

# packages/event-engine

## Responsabilidade

Fluxo distribuído.

---

## Features

- event tracing
- replay
- timeline
- payload linking

---

# OpenSpec Workflow

# Estrutura

```txt id="jlwm4r"
/specs
  SPEC-001-runtime-provider.md
  SPEC-002-sse-streaming.md
```

---

# Template Oficial de SPEC

```md id="jlwm2j"
# SPEC-XXX — Nome

## Objetivo

## Contexto

## Problema

## Fluxo funcional

## Regras

## Contratos

## Casos de erro

## Critérios de aceite

## Fora do escopo

## Dependências

## Riscos

## Métricas
```

---

# Regra Principal

## Nenhuma feature começa sem:

- SPEC
- contrato
- critérios de aceite

---

# ADR Workflow

# Estrutura

```txt id="9wvjlwm"
/adr
  ADR-001-nextjs.md
  ADR-002-sse.md
```

---

# Template ADR

```md id="jlwm4x"
# ADR-001 — Título

## Status

Accepted

## Contexto

## Decisão

## Consequências

## Alternativas consideradas
```

---

# Contracts

# Estrutura

```txt id="jlwm2z"
/contracts
  logs-stream.json
  replay-event.json
```

---

# Objetivo

Definir:

- payloads
- responses
- SSE formats
- APIs

---

# Fluxos

# Estrutura

```txt id="jlwm8s"
/flows
  sns-sqs-worker.md
  logs-correlation.md
```

---

# Objetivo

Descrever:

- fluxo funcional
- eventos
- runtime behavior

---

# Storybook Strategy

# Objetivo

Toda UI crítica deve nascer no Storybook.

---

# Componentes obrigatórios

| Componente       | Obrigatório |
| ---------------- | ----------- |
| LogViewer        | sim         |
| JsonViewer       | sim         |
| EventTimeline    | sim         |
| QueueReplayModal | sim         |
| RuntimeStatus    | sim         |

---

# Estrutura

```txt id="jlwm9b"
Button.stories.tsx
LogViewer.stories.tsx
```

---

# Regras

## Componentes devem:

- funcionar isoladamente
- possuir mock data
- possuir loading/error states

---

# UI Philosophy

## NÃO copiar AWS Console

---

# Regras

## Workflow-first

Não:

```txt id="6jlwm0"
Resources → CRUD
```

Mas:

```txt id="jlwm8o"
Logs → Event → Debugging
```

---

# Navegação rasa

Máximo:

- 2 níveis

---

# Busca global

Tudo pesquisável.

---

# Correlation-first

IDs são navegáveis.

---

# Streaming-first

Nada de refresh manual.

---

# Backend Architecture

# Estratégia

Next.js fullstack.

---

# Fluxo

```txt id="jlwm3q"
Frontend
   ↓
Route Handlers
   ↓
Runtime SDK
   ↓
MiniStack/LocalStack
```

---

# Regra

## Frontend NUNCA acessa AWS diretamente.

---

# SSE Architecture

# Objetivo

Realtime logs.

---

# Fluxo

```txt id="jlwm6z"
Browser
 ↓
SSE endpoint
 ↓
Runtime stream
```

---

# Features obrigatórias

- reconnect
- heartbeat
- pause
- auto-scroll

---

# Runtime Abstraction

# Objetivo

Trocar runtime sem alterar UI.

---

# Providers

```txt id="r3jlwm"
MiniStackProvider
LocalStackProvider
AwsProvider
```

---

# Docker Strategy

# Objetivo

Setup em menos de 2 minutos.

---

# Profiles

```txt id="jlwm0y"
docker-compose.ministack.yml
docker-compose.localstack.yml
```

---

# Developer Workflow

# Fluxo oficial

---

# 1️⃣ Criar SPEC

```txt id="jlwm5y"
SPEC-006-log-streaming.md
```

---

# 2️⃣ Criar contrato

```txt id="jlwm9d"
contracts/log-stream.json
```

---

# 3️⃣ Criar fluxo

```txt id="u5jlwm"
flows/log-correlation.md
```

---

# 4️⃣ Criar Storybook

```txt id="jlwm4m"
LogViewer.stories.tsx
```

---

# 5️⃣ Implementar

---

# 6️⃣ Validar critérios de aceite

---

# Roadmap Inicial

---

# Sprint 1

## Fundação

- monorepo
- OpenSpec
- Storybook
- runtime-sdk
- Next.js app

---

# Sprint 2

## Logs realtime

- SSE
- parser
- filters
- JSON viewer

---

# Sprint 3

## Queue debugging

- SQS
- replay
- DLQ
- payload explorer

---

# Sprint 4

## SNS flow

- publish
- subscribers
- event timeline

---

# Sprint 5

## Secrets + S3

- secrets CRUD
- bucket explorer
- previews

---

# Quality Rules

## Obrigatório

- TypeScript strict
- ESLint
- Husky
- Conventional commits

---

# Não permitido

- AWS SDK no frontend
- lógica runtime em componentes
- componentes sem Storybook
- feature sem SPEC

---

# Objetivo Final

Criar:

# a melhor experiência open-source para debugging local de sistemas distribuídos AWS-compatible.
