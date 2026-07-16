# Progresso de Implementação — MiniStack UI

> Documento vivo. Atualize os checkboxes conforme cada fase do Spec Kit avança.
> Base: [`roadmap.md`](./roadmap.md) · Processo: [`.specify/memory/constitution.md`](../.specify/memory/constitution.md)

**Última atualização:** 2026-07-09

---

## Como usar este documento

Cada spec **nova** passa pelas 6 fases do Spec Kit, em ordem, sem pular etapas (Princípio I).
Marque a fase como concluída somente depois que o artefato correspondente existir em
`specs/[feature]/`:

| Fase         | Comando              | Artefato esperado                                       |
| ------------ | -------------------- | ------------------------------------------------------- |
| 1. Specify   | `/speckit.specify`   | `specs/[feature]/spec.md`                               |
| 2. Clarify   | `/speckit.clarify`   | ambiguidades resolvidas no `spec.md`                    |
| 3. Plan      | `/speckit.plan`      | `plan.md`, `data-model.md`, `research.md`, `contracts/` |
| 4. Tasks     | `/speckit.tasks`     | `specs/[feature]/tasks.md`                              |
| 5. Implement | `/speckit.implement` | código + stories + testes                               |
| 6. Validado  | —                    | todos os critérios de aceite do `spec.md` conferidos    |

**Legenda de status:** ⬜ Não iniciado · 🔄 Em andamento · ✅ Concluído · ⏸️ Bloqueado

---

## Legado (OpenSpec) — resumo de progresso

| Item                                                                                                           | Status                                                          |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Fundação do monorepo (turbo, pnpm, eslint-config, packages/shared)                                             | ✅ Concluído (PR #1)                                            |
| `packages/ui` (Button, LogViewer, JsonTree, EventTimeline, QueueCard, MiniLineChart, StatusBadge, ServiceIcon) | ✅ Concluído (PR #1)                                            |
| `packages/runtime-sdk` (interface + MiniStack/LocalStack/AWS providers)                                        | ✅ Concluído, com stubs (ver gaps)                              |
| `packages/log-engine`, `packages/event-engine`                                                                 | ✅ Concluído (PR #1)                                            |
| `apps/web`, `apps/storybook`, `apps/docs`                                                                      | ✅ Concluído (PR #1)                                            |
| Log streaming via SSE                                                                                          | ✅ Concluído (PR #2)                                            |
| Descoberta de log groups/streams                                                                               | ✅ Concluído (PR #3)                                            |
| Página de gestão de CloudWatch Log Groups                                                                      | 🔄 PR #4 aberto                                                 |
| Stories para `EventTimeline` e `QueueCard`                                                                     | ⬜ Pendente (dívida técnica, Princípio VII)                     |
| `RuntimeProvider.logs/queues/topics/secrets()` reais (hoje são stubs)                                          | ⬜ Pendente — cada spec nova implementa o método correspondente |

---

## Specs Novas (Spec Kit)

| Spec                            | Tema               | Status | Dependências |
| ------------------------------- | ------------------ | ------ | ------------ |
| [001](#001--secrets-manager)    | secrets-manager    | ⬜     | —            |
| [002](#002--s3-bucket-explorer) | s3-bucket-explorer | ⬜     | —            |
| [003](#003--sqs-queue-browser)  | sqs-queue-browser  | ⬜     | —            |
| [004](#004--dlq-replay)         | dlq-replay         | ⬜     | 003          |
| [005](#005--sns-topic-browser)  | sns-topic-browser  | ⬜     | —            |
| [006](#006--event-timeline)     | event-timeline     | ⬜     | 005, 003     |

---

### 001 — secrets-manager

**Pasta:** `specs/001-secrets-manager/` · **Status:** ⬜ Não iniciado · **Dependências:** nenhuma

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `RuntimeProvider.secrets()` implementado (MiniStack/LocalStack/AWS)
- [ ] Route Handlers: `GET/POST/PUT/DELETE /api/secrets`
- [ ] Listagem com valor mascarado (reveal on click)
- [ ] Criação e edição com validação

> Sem histórico de versões — fora de escopo (não suportado no runtime local).

---

### 002 — s3-bucket-explorer

**Pasta:** `specs/002-s3-bucket-explorer/` · **Status:** ⬜ Não iniciado · **Dependências:** nenhuma

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `RuntimeProvider.buckets()` — novo método (MiniStack/LocalStack/AWS)
- [ ] Route Handlers: `GET /api/buckets`, `GET /api/buckets/:name/objects`, `GET /api/buckets/:name/objects/:key`
- [ ] Navegação por prefixo (pseudo-diretórios)
- [ ] Preview: texto, JSON (via `JsonTree`), imagem
- [ ] Download de objeto

---

### 003 — sqs-queue-browser

**Pasta:** `specs/003-sqs-queue-browser/` · **Status:** ⬜ Não iniciado · **Dependências:** nenhuma

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `RuntimeProvider.queues()` implementado (MiniStack/LocalStack/AWS)
- [ ] Route Handlers: `GET /api/queues`, `GET /api/queues/:name/messages`
- [ ] `QueueCard` — story + interaction test (dívida técnica existente, resolver aqui)
- [ ] Visualização de payload via `JsonTree`

---

### 004 — dlq-replay

**Pasta:** `specs/004-dlq-replay/` · **Status:** ⬜ Não iniciado · **Dependências:** 003

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handlers: `POST /api/queues/:name/replay`, `DELETE /api/queues/:name/messages/:id`
- [ ] `QueueReplayModal` — componente novo, story + interaction test
- [ ] Registro de replay como evento rastreável (`packages/event-engine`)

---

### 005 — sns-topic-browser

**Pasta:** `specs/005-sns-topic-browser/` · **Status:** ⬜ Não iniciado · **Dependências:** nenhuma

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `RuntimeProvider.topics()` implementado (MiniStack/LocalStack/AWS)
- [ ] Route Handlers: `GET /api/topics`, `GET /api/topics/:name/subscriptions`, `POST /api/topics/:name/publish`
- [ ] Formulário de publish manual com validação de payload JSON

---

### 006 — event-timeline

**Pasta:** `specs/006-event-timeline/` · **Status:** ⬜ Não iniciado · **Dependências:** 005, 003

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `EventTimeline` — story + interaction test (dívida técnica existente, resolver aqui)
- [ ] Navegação por correlation ID
- [ ] Route Handler: `GET /api/events/stream` (SSE)
- [ ] `packages/event-engine`: correlação SNS ↔ SQS

---

## Registro de mudanças

| Data       | Mudança                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-09 | Documentação Spec Kit recriada sobre a ponta real de `main`. A tentativa anterior (branch `docs/migrate-to-spec-kit`) tinha sido cortada do commit inicial do repositório, antes de 4 PRs de trabalho real (OpenSpec) serem mesclados — gerou um PR duplicado (#5, fechado sem merge) e suposições incorretas sobre nomes de componentes e a interface `RuntimeProvider`. Este documento reflete o estado real do código. |
