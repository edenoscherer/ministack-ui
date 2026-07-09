# Roadmap de Implementação — MiniStack UI

> Este roadmap tem duas partes: **Legado** (já implementado via OpenSpec, antes da migração para
> Spec Kit) e **Specs Novas** (a implementar via Spec Kit, `/speckit.specify` em diante).
> Ver [`PROGRESS.md`](./PROGRESS.md) para o detalhamento por item de entrega.

---

## Parte 1 — Legado (OpenSpec, já implementado)

Construído antes da migração para Spec Kit. Registro histórico em `openspec/specs/` e
`openspec/changes/archive/` — **não é reescrito retroativamente como spec Spec Kit**
(`.specify/memory/constitution.md`, Princípio I).

| Tema                                                                                                        | OpenSpec change                       | Status                                   |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------- |
| Fundação do monorepo (Turborepo, pnpm, eslint-config, packages/shared, apps/web, apps/storybook, apps/docs) | `2026-05-29-setup-monorepo-structure` | ✅ Merged (PR #1)                        |
| `packages/runtime-sdk` (interface `RuntimeProvider`, providers MiniStack/LocalStack/AWS)                    | `2026-05-29-setup-monorepo-structure` | ✅ Merged (PR #1)                        |
| `packages/log-engine`, `packages/event-engine`                                                              | `2026-05-29-setup-monorepo-structure` | ✅ Merged (PR #1)                        |
| Log streaming em tempo real via SSE                                                                         | `2026-05-30-sprint-2-logs-realtime`   | ✅ Merged (PR #2)                        |
| Descoberta de log groups/streams (estilo CloudWatch)                                                        | `2026-05-30-logs-groups-stream`       | ✅ Merged (PR #3)                        |
| Dashboard / filtro por serviço                                                                              | `2026-05-30-update-interface-lovable` | ✅ Merged                                |
| Página de gestão de CloudWatch Log Groups (`/cloudwatch/logs`, `LogGroupsTable`)                            | `cloudwatch-log-groups-management`    | 🔄 PR #4 aberto, aguardando review/merge |

**Gaps conhecidos no que já foi implementado** (não bloqueiam as specs novas, mas valem nota):

- `RuntimeProvider.logs()`, `.queues()`, `.topics()`, `.secrets()` são placeholders (`throw new
Error('not implemented')`) — só `streamLogs()`, `getLogGroups()`, `getLogStreams()` têm
  implementação real, e mesmo essa usa dados mockados (`mockHelper`), não uma conexão real ao
  MiniStack ainda.
- `EventTimeline` e `QueueCard` (em `packages/ui`) existem mas não têm `.stories.tsx` — dívida
  técnica do Princípio VII da constituição.

---

## Parte 2 — Specs Novas (Spec Kit)

Ordem de prioridade definida pelo produto: **Secrets Manager → S3 → SQS → SNS** (Logs já
implementado no legado, ver Parte 1).

| Ordem | Spec                 | Tema                                                                         |
| ----- | -------------------- | ---------------------------------------------------------------------------- |
| 001   | `secrets-manager`    | CRUD de secrets com valor mascarado                                          |
| 002   | `s3-bucket-explorer` | Exploração de buckets S3 com preview de objetos                              |
| 003   | `sqs-queue-browser`  | Listagem de filas SQS e mensagens                                            |
| 004   | `dlq-replay`         | Replay de mensagens de DLQ                                                   |
| 005   | `sns-topic-browser`  | Listagem de tópicos SNS, publish manual                                      |
| 006   | `event-timeline`     | Timeline SNS → SQS → workers (usa o componente `EventTimeline` já existente) |

Todas dependem de `packages/runtime-sdk` (já existe) ganhar implementação real para o recurso
correspondente (`queues()`, `topics()`, `secrets()`, e um novo método `buckets()` para S3) antes
do Route Handler da feature poder consumi-la — ver Princípio II da constituição.

### 001 — secrets-manager

**Pasta:** `specs/001-secrets-manager/`

CRUD completo de secrets com visualização mascarada.

**Entrega esperada:**

- `RuntimeProvider.secrets()` implementado nos três providers (hoje é stub)
- Route Handlers: `GET/POST/PUT/DELETE /api/secrets`
- Listagem com valor mascarado (reveal on click)
- Criação e edição com validação
- Sem histórico de versões (não suportado no runtime local)

**Dependências:** nenhuma (fundação já existe no legado)

---

### 002 — s3-bucket-explorer

**Pasta:** `specs/002-s3-bucket-explorer/`

Exploração de buckets S3 com navegação por prefixo e preview de objetos.

**Entrega esperada:**

- `RuntimeProvider.buckets()` — novo método, implementado nos três providers
- Route Handlers: `GET /api/buckets`, `GET /api/buckets/:name/objects`, `GET /api/buckets/:name/objects/:key`
- Navegação por prefixo (pseudo-diretórios)
- Preview: texto, JSON (via `JsonTree`), imagem
- Download de objeto

**Dependências:** nenhuma

---

### 003 — sqs-queue-browser

**Pasta:** `specs/003-sqs-queue-browser/`

Listagem de filas SQS, contagem de mensagens, status e visualização de mensagens individuais.

**Entrega esperada:**

- `RuntimeProvider.queues()` implementado nos três providers (hoje é stub)
- Route Handlers: `GET /api/queues`, `GET /api/queues/:name/messages`
- `QueueCard` (já existe em `packages/ui` — falta story/interaction test, resolver junto desta spec)
- Visualização de payload via `JsonTree`

**Dependências:** nenhuma

---

### 004 — dlq-replay

**Pasta:** `specs/004-dlq-replay/`

Replay de mensagens de DLQ para a fila de origem.

**Entrega esperada:**

- Route Handlers: `POST /api/queues/:name/replay`, `DELETE /api/queues/:name/messages/:id`
- `QueueReplayModal` — componente novo, story + interaction test obrigatórios (Princípio IV/VII)
- Registro de replay como evento rastreável (`packages/event-engine`)

**Dependências:** `003`

---

### 005 — sns-topic-browser

**Pasta:** `specs/005-sns-topic-browser/`

Listagem de tópicos SNS, subscribers, e publicação manual de mensagens.

**Entrega esperada:**

- `RuntimeProvider.topics()` implementado nos três providers (hoje é stub)
- Route Handlers: `GET /api/topics`, `GET /api/topics/:name/subscriptions`, `POST /api/topics/:name/publish`
- Formulário de publish manual com validação de payload JSON

**Dependências:** nenhuma

---

### 006 — event-timeline

**Pasta:** `specs/006-event-timeline/`

Timeline visual de eventos distribuídos correlacionando SNS → SQS → workers.

**Entrega esperada:**

- `EventTimeline` (já existe em `packages/ui` — falta story/interaction test, resolver junto desta spec)
- Navegação por correlation ID
- Route Handler: `GET /api/events/stream` (SSE)
- `packages/event-engine`: correlação entre eventos SNS e mensagens SQS

**Dependências:** `005`, `003` (correlaciona filas e tópicos)

---

## Ordem de Criação das Specs

```bash
/speckit.specify  →  specs/001-secrets-manager/
/speckit.specify  →  specs/002-s3-bucket-explorer/
/speckit.specify  →  specs/003-sqs-queue-browser/
/speckit.specify  →  specs/004-dlq-replay/
/speckit.specify  →  specs/005-sns-topic-browser/
/speckit.specify  →  specs/006-event-timeline/
```

> Após a spec de cada feature estar aprovada, executar `/speckit.plan` e `/speckit.tasks`
> antes de iniciar o `/speckit.implement`.
