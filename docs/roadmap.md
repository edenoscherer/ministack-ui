# Roadmap de Implementação — MiniStack UI

## Visão Geral

| Sprint | Tema | Specs | Duração estimada |
|--------|------|-------|-----------------|
| 1 | Fundação | 001–004 | 4 specs |
| 2 | Logs Realtime | 005–006 | 2 specs |
| 3 | Queue Debugging | 007–008 | 2 specs |
| 4 | SNS Flow | 009–010 | 2 specs |
| 5 | Secrets + S3 | 011–012 | 2 specs |

**Total: 12 specs**

---

## Sprint 1 — Fundação

Objetivo: repositório funcional, design system base, runtime abstraction e scaffold do app. Nenhuma feature de produto ainda — apenas a base que viabiliza todos os sprints seguintes.

### 001 — monorepo-foundation

**Pasta:** `specs/001-monorepo-foundation/`

Configura o monorepo Turborepo + pnpm workspaces com todas as ferramentas de qualidade.

**Entrega:**
- `turbo.json` + `pnpm-workspace.yaml` + `package.json` raiz
- `packages/eslint-config` — regras TypeScript strict compartilhadas
- `packages/shared` — tipos base compartilhados
- Husky + Conventional Commits + lint-staged
- Pipeline `turbo run build | lint | typecheck | test`

**Dependências:** nenhuma

---

### 002 — runtime-sdk

**Pasta:** `specs/002-runtime-sdk/`

Interface `RuntimeProvider` e implementação `MiniStackProvider` para uso em testes e desenvolvimento local.

**Entrega:**
- `packages/runtime-sdk` com interface `RuntimeProvider`
- `MiniStackProvider` conectando ao MiniStack via AWS SDK v3
- `docker-compose.ministack.yml` com setup em < 2 minutos
- Testes de integração do SDK usando MiniStack

**Dependências:** `001`

---

### 003 — web-app-skeleton

**Pasta:** `specs/003-web-app-skeleton/`

Scaffold do `apps/web` com estrutura de pastas, providers, layout base e navegação.

**Entrega:**
- `apps/web` com App Router Next.js 15
- Estrutura: `app/`, `components/`, `hooks/`, `services/`, `providers/`, `store/`, `styles/`
- Layout base com navegação de 2 níveis
- TanStack Query provider + Zustand store vazio
- Busca global (estrutura, sem dados ainda)
- Página de status do runtime (`RuntimeStatus` em uso)

**Dependências:** `001`, `002`

---

### 004 — storybook-foundation

**Pasta:** `specs/004-storybook-foundation/`

Setup do `apps/storybook` com design system base e primitivos de UI.

**Entrega:**
- `apps/storybook` configurado com Tailwind + shadcn/ui
- Primitivos: `Button`, `Card`, `Badge`, `Spinner`, `EmptyState`, `ErrorState`
- `RuntimeStatus` — indicador de conexão com runtime (MiniStack/LocalStack/AWS)
- Stories para todos os primitivos com loading + error states
- Interaction tests para `RuntimeStatus`

**Dependências:** `001`

---

## Sprint 2 — Logs Realtime

Objetivo: streaming de logs em tempo real do fim ao fim, do runtime ao browser.

### 005 — sse-log-streaming

**Pasta:** `specs/005-sse-log-streaming/`

Infraestrutura SSE completa + `packages/log-engine` para ingestão e processamento de logs.

**Entrega:**
- Route Handler SSE: `GET /api/logs/stream`
- `packages/log-engine`: parsing, correlation, filtering, formatting
- Reconexão automática com backoff, heartbeat, pause/resume
- Correlação de logs por `requestId`, `traceId`, `serviceId`
- Testes de integração do endpoint SSE com MiniStackProvider

**Dependências:** `001`, `002`, `003`

---

### 006 — log-viewer-ui

**Pasta:** `specs/006-log-viewer-ui/`

Componentes `LogViewer` e `JsonViewer` com UI de filtros e integração com o stream SSE.

**Entrega:**
- `LogViewer`: stream ao vivo, auto-scroll, pause, clear, highlight por nível
- `JsonViewer`: collapse/expand, syntax highlight, cópia de valores
- Filtros: nível (INFO/WARN/ERROR), serviço, texto livre
- `packages/ui`: `LogViewer`, `JsonViewer` exportados
- Stories e interaction tests obrigatórios para ambos
- Integração com `GET /api/logs/stream` em `apps/web`

**Dependências:** `004`, `005`

---

## Sprint 3 — Queue Debugging

Objetivo: visibilidade e controle total sobre filas SQS, incluindo DLQ e replay.

### 007 — sqs-queue-browser

**Pasta:** `specs/007-sqs-queue-browser/`

Listagem de filas SQS, contagem de mensagens, status e visualização de mensagens individuais.

**Entrega:**
- Route Handlers: `GET /api/queues`, `GET /api/queues/:name/messages`
- `QueueCard` — card com nome, contagem, status, tipo (padrão/DLQ/FIFO)
- Página de filas com busca global integrada
- Visualização de payload de mensagem via `JsonViewer`
- Stories e interaction tests para `QueueCard`

**Dependências:** `002`, `003`, `004`

---

### 008 — dlq-replay

**Pasta:** `specs/008-dlq-replay/`

Replay de mensagens de DLQ para a fila de origem, com exploração detalhada de payload.

**Entrega:**
- Route Handlers: `POST /api/queues/:name/replay`, `DELETE /api/queues/:name/messages/:id`
- `QueueReplayModal` — seleção de mensagens, preview de payload, confirmação
- `packages/event-engine`: registro de replay como evento rastreável
- Histórico de replays com status (sucesso/falha)
- Stories e interaction tests para `QueueReplayModal`

**Dependências:** `007`

---

## Sprint 4 — SNS Flow

Objetivo: visibilidade do fluxo de eventos SNS e correlação com filas SQS.

### 009 — sns-topic-browser

**Pasta:** `specs/009-sns-topic-browser/`

Listagem de tópicos SNS, subscribers, e publicação manual de mensagens.

**Entrega:**
- Route Handlers: `GET /api/topics`, `GET /api/topics/:name/subscriptions`, `POST /api/topics/:name/publish`
- Página de tópicos com subscribers expandíveis
- Formulário de publish manual com validação de payload JSON
- `packages/event-engine`: ingestão de eventos SNS

**Dependências:** `002`, `003`, `004`

---

### 010 — event-timeline

**Pasta:** `specs/010-event-timeline/`

Timeline visual de eventos distribuídos correlacionando SNS → SQS → workers.

**Entrega:**
- `EventTimeline` — linha do tempo com eventos, timestamps, correlação de IDs
- Navegação por correlation ID (clicar em ID abre contexto relacionado)
- `packages/event-engine`: replay, correlação entre eventos SNS e mensagens SQS
- Route Handler: `GET /api/events/stream` (SSE)
- Stories e interaction tests para `EventTimeline`

**Dependências:** `009`, `005` (SSE)

---

## Sprint 5 — Secrets + S3

Objetivo: gestão de secrets e exploração de buckets S3 com preview de objetos.

### 011 — secrets-manager

**Pasta:** `specs/011-secrets-manager/`

CRUD completo de secrets com visualização mascarada e histórico de versões.

**Entrega:**
- Route Handlers: `GET/POST/PUT/DELETE /api/secrets`
- Listagem com valor mascarado (reveal on click)
- Criação e edição com validação
- Histórico de versões por secret
- Integração com `RuntimeStatus` (secrets dependem do runtime ativo)

**Dependências:** `002`, `003`, `004`

---

### 012 — s3-bucket-explorer

**Pasta:** `specs/012-s3-bucket-explorer/`

Exploração de buckets S3 com navegação por prefixo e preview de objetos.

**Entrega:**
- Route Handlers: `GET /api/buckets`, `GET /api/buckets/:name/objects`, `GET /api/buckets/:name/objects/:key`
- Navegação por prefixo (pseudo-diretórios)
- Preview: texto, JSON (via `JsonViewer`), imagem
- Download de objeto
- Busca global integrada com objetos S3

**Dependências:** `002`, `003`, `004`

---

## Grafo de Dependências

```txt
001-monorepo-foundation
  ├── 002-runtime-sdk
  │     └── 003-web-app-skeleton
  │           ├── 005-sse-log-streaming
  │           │     └── 006-log-viewer-ui ←── 004
  │           ├── 007-sqs-queue-browser ←──── 004
  │           │     └── 008-dlq-replay
  │           ├── 009-sns-topic-browser ←──── 004
  │           │     └── 010-event-timeline ←── 005
  │           ├── 011-secrets-manager ←─────── 004
  │           └── 012-s3-bucket-explorer ←──── 004
  └── 004-storybook-foundation
```

---

## Ordem de Criação das Specs

Executar `/speckit.specify` nesta sequência:

```bash
# Sprint 1 (sequencial — fundação crítica)
/speckit.specify  →  specs/001-monorepo-foundation/
/speckit.specify  →  specs/002-runtime-sdk/
/speckit.specify  →  specs/003-web-app-skeleton/
/speckit.specify  →  specs/004-storybook-foundation/

# Sprint 2
/speckit.specify  →  specs/005-sse-log-streaming/
/speckit.specify  →  specs/006-log-viewer-ui/

# Sprint 3
/speckit.specify  →  specs/007-sqs-queue-browser/
/speckit.specify  →  specs/008-dlq-replay/

# Sprint 4
/speckit.specify  →  specs/009-sns-topic-browser/
/speckit.specify  →  specs/010-event-timeline/

# Sprint 5
/speckit.specify  →  specs/011-secrets-manager/
/speckit.specify  →  specs/012-s3-bucket-explorer/
```

> Após a spec de cada feature estar aprovada, executar `/speckit.plan` e `/speckit.tasks`
> antes de iniciar o `/speckit.implement`.
