# Roadmap de Implementação — MiniStack UI

## Visão Geral

| Sprint | Tema                                | Specs   | Duração estimada |
| ------ | ----------------------------------- | ------- | ---------------- |
| 1      | Fundação                            | 001–004 | 4 specs          |
| 2      | Secrets Manager                     | 005     | 1 spec           |
| 3      | S3                                  | 006     | 1 spec           |
| 4      | Logs (CloudWatch)                   | 007–009 | 3 specs          |
| 5      | Queue Debugging (SQS)               | 010–011 | 2 specs          |
| 6      | SNS Flow                            | 012–013 | 2 specs          |
| —      | Documentação Pública (independente) | 014     | 1 spec           |

**Total: 14 specs**

> Ordem de prioridade definida pelo produto (após a fundação): **Secrets Manager → S3 → Logs → SQS → SNS**.

---

## Sprint 1 — Fundação

Objetivo: repositório funcional, design system base, runtime abstraction e scaffold do app. Nenhuma feature de produto ainda — apenas a base que viabiliza todos os sprints seguintes.

### 001 — monorepo-foundation

**Pasta:** `specs/001-monorepo-foundation/` · **Status:** ✅ Concluído

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
- `docker-compose.ministack.yml` com setup em < 2 minutos (caminho principal)
- `docker-compose.localstack.yml` como exemplo/testes do `LocalStackProvider`, em container isolado do MiniStack
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

## Sprint 2 — Secrets Manager

Objetivo: primeira feature de produto. CRUD completo de secrets com visualização mascarada.

### 005 — secrets-manager

**Pasta:** `specs/005-secrets-manager/`

CRUD completo de secrets com visualização mascarada.

**Entrega:**

- Route Handlers: `GET/POST/PUT/DELETE /api/secrets`
- Listagem com valor mascarado (reveal on click)
- Criação e edição com validação
- Integração com `RuntimeStatus` (secrets dependem do runtime ativo)

> Sem histórico de versões nesta spec — fora de escopo (não suportado no runtime local).

**Dependências:** `002`, `003`, `004`

---

## Sprint 3 — S3

Objetivo: exploração de buckets S3 com navegação por prefixo e preview de objetos.

### 006 — s3-bucket-explorer

**Pasta:** `specs/006-s3-bucket-explorer/`

Exploração de buckets S3 com navegação por prefixo e preview de objetos.

**Entrega:**

- Route Handlers: `GET /api/buckets`, `GET /api/buckets/:name/objects`, `GET /api/buckets/:name/objects/:key`
- Navegação por prefixo (pseudo-diretórios)
- Preview: texto, JSON (via `JsonViewer`), imagem
- Download de objeto
- Busca global integrada com objetos S3

**Dependências:** `002`, `003`, `004`

---

## Sprint 4 — Logs (CloudWatch)

Objetivo: visibilidade completa de logs — descoberta de log groups/streams (estilo CloudWatch Logs) e streaming em tempo real do fim ao fim, do runtime ao browser.

### 007 — log-group-browser

**Pasta:** `specs/007-log-group-browser/`

Listagem e navegação de log groups e log streams (estilo CloudWatch Logs), ponto de entrada para o streaming em tempo real.

> Confirmado: o runtime expõe a API real de CloudWatch Logs (`DescribeLogGroups`/`DescribeLogStreams`
> via AWS SDK v3 `CloudWatchLogsClient`) — não é agregação de stdout/stderr de containers.

**Entrega:**

- Route Handlers: `GET /api/logs/groups`, `GET /api/logs/groups/:name/streams`
- `LogGroupCard` — card com nome do grupo, serviço associado, contagem de streams, retenção
- Página de log groups com busca global integrada
- Seleção de grupo/stream como ponto de entrada para o streaming SSE (spec `008`)
- Stories e interaction tests para `LogGroupCard`

**Dependências:** `002`, `003`, `004`

---

### 008 — sse-log-streaming

**Pasta:** `specs/008-sse-log-streaming/`

Infraestrutura SSE completa + `packages/log-engine` para ingestão e processamento de logs do grupo/stream selecionado.

**Entrega:**

- Route Handler SSE: `GET /api/logs/stream` (parametrizado por grupo/stream selecionado em `007`)
- `packages/log-engine`: parsing, correlation, filtering, formatting
- Reconexão automática com backoff, heartbeat, pause/resume
- Correlação de logs por `requestId`, `traceId`, `serviceId`
- Testes de integração do endpoint SSE com MiniStackProvider

**Dependências:** `002`, `003`, `007`

---

### 009 — log-viewer-ui

**Pasta:** `specs/009-log-viewer-ui/`

Componentes `LogViewer` e `JsonViewer` com UI de filtros e integração com o stream SSE.

**Entrega:**

- `LogViewer`: stream ao vivo, auto-scroll, pause, clear, highlight por nível
- `JsonViewer`: collapse/expand, syntax highlight, cópia de valores
- Filtros: nível (INFO/WARN/ERROR), serviço, texto livre
- `packages/ui`: `LogViewer`, `JsonViewer` exportados
- Stories e interaction tests obrigatórios para ambos
- Integração com `GET /api/logs/stream` em `apps/web`

**Dependências:** `004`, `008`

---

## Sprint 5 — Queue Debugging (SQS)

Objetivo: visibilidade e controle total sobre filas SQS, incluindo DLQ e replay.

### 010 — sqs-queue-browser

**Pasta:** `specs/010-sqs-queue-browser/`

Listagem de filas SQS, contagem de mensagens, status e visualização de mensagens individuais.

**Entrega:**

- Route Handlers: `GET /api/queues`, `GET /api/queues/:name/messages`
- `QueueCard` — card com nome, contagem, status, tipo (padrão/DLQ/FIFO)
- Página de filas com busca global integrada
- Visualização de payload de mensagem via `JsonViewer`
- Stories e interaction tests para `QueueCard`

**Dependências:** `002`, `003`, `004`

---

### 011 — dlq-replay

**Pasta:** `specs/011-dlq-replay/`

Replay de mensagens de DLQ para a fila de origem, com exploração detalhada de payload.

**Entrega:**

- Route Handlers: `POST /api/queues/:name/replay`, `DELETE /api/queues/:name/messages/:id`
- `QueueReplayModal` — seleção de mensagens, preview de payload, confirmação
- `packages/event-engine`: registro de replay como evento rastreável
- Histórico de replays com status (sucesso/falha)
- Stories e interaction tests para `QueueReplayModal`

**Dependências:** `010`

---

## Sprint 6 — SNS Flow

Objetivo: visibilidade do fluxo de eventos SNS e correlação com filas SQS.

### 012 — sns-topic-browser

**Pasta:** `specs/012-sns-topic-browser/`

Listagem de tópicos SNS, subscribers, e publicação manual de mensagens.

**Entrega:**

- Route Handlers: `GET /api/topics`, `GET /api/topics/:name/subscriptions`, `POST /api/topics/:name/publish`
- Página de tópicos com subscribers expandíveis
- Formulário de publish manual com validação de payload JSON
- `packages/event-engine`: ingestão de eventos SNS

**Dependências:** `002`, `003`, `004`

---

### 013 — event-timeline

**Pasta:** `specs/013-event-timeline/`

Timeline visual de eventos distribuídos correlacionando SNS → SQS → workers.

**Entrega:**

- `EventTimeline` — linha do tempo com eventos, timestamps, correlação de IDs
- Navegação por correlation ID (clicar em ID abre contexto relacionado)
- `packages/event-engine`: replay, correlação entre eventos SNS e mensagens SQS
- Route Handler: `GET /api/events/stream` (SSE)
- Stories e interaction tests para `EventTimeline`

**Dependências:** `012`, `008` (SSE)

---

## Documentação Pública (independente)

Objetivo: documentação pública do projeto via Nextra. Não bloqueia nem é bloqueada pelas demais
specs de produto — depende apenas da fundação do monorepo. Pode ser executada em paralelo, a
qualquer momento após `001`.

### 014 — public-docs-nextra

**Pasta:** `specs/014-public-docs-nextra/`

Scaffold do `apps/docs` com Nextra para documentação pública do projeto.

**Entrega:**

- `apps/docs` configurado com Nextra
- Estrutura de navegação para documentar arquitetura, runtime providers e specs
- Publicação do conteúdo de `docs/doc.md` e `docs/roadmap.md` como páginas navegáveis
- Pipeline de build incluído em `turbo run build`

**Dependências:** `001`

---

## Grafo de Dependências

```txt
001-monorepo-foundation
  ├── 002-runtime-sdk
  │     └── 003-web-app-skeleton
  │           ├── 005-secrets-manager ─────────── 004
  │           ├── 006-s3-bucket-explorer ───────── 004
  │           ├── 007-log-group-browser ────────── 004
  │           │     └── 008-sse-log-streaming
  │           │           └── 009-log-viewer-ui ── 004
  │           ├── 010-sqs-queue-browser ────────── 004
  │           │     └── 011-dlq-replay
  │           └── 012-sns-topic-browser ────────── 004
  │                 └── 013-event-timeline ─────── 008
  └── 004-storybook-foundation

014-public-docs-nextra ─────────────────────────── 001  (independente, paralelo)
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

# Sprint 2 — Secrets Manager
/speckit.specify  →  specs/005-secrets-manager/

# Sprint 3 — S3
/speckit.specify  →  specs/006-s3-bucket-explorer/

# Sprint 4 — Logs (CloudWatch)
/speckit.specify  →  specs/007-log-group-browser/
/speckit.specify  →  specs/008-sse-log-streaming/
/speckit.specify  →  specs/009-log-viewer-ui/

# Sprint 5 — Queue Debugging (SQS)
/speckit.specify  →  specs/010-sqs-queue-browser/
/speckit.specify  →  specs/011-dlq-replay/

# Sprint 6 — SNS Flow
/speckit.specify  →  specs/012-sns-topic-browser/
/speckit.specify  →  specs/013-event-timeline/

# Independente (qualquer momento após 001)
/speckit.specify  →  specs/014-public-docs-nextra/
```

> Após a spec de cada feature estar aprovada, executar `/speckit.plan` e `/speckit.tasks`
> antes de iniciar o `/speckit.implement`.
