# Progresso de Implementação — MiniStack UI

> Documento vivo. Atualize os checkboxes conforme cada fase do Spec Kit avança.
> Base: [`roadmap.md`](./roadmap.md) · Processo: [`.specify/memory/constitution.md`](../.specify/memory/constitution.md)

**Última atualização:** 2026-07-09

---

## Como usar este documento

Cada spec do roadmap passa pelas mesmas 6 fases do Spec Kit, em ordem, sem pular etapas
(Princípio I da Constituição). Marque a fase como concluída somente depois que o artefato
correspondente existir em `specs/[feature]/`:

| Fase         | Comando              | Artefato esperado                                       |
| ------------ | -------------------- | ------------------------------------------------------- |
| 1. Specify   | `/speckit.specify`   | `specs/[feature]/spec.md`                               |
| 2. Clarify   | `/speckit.clarify`   | ambiguidades resolvidas no `spec.md`                    |
| 3. Plan      | `/speckit.plan`      | `plan.md`, `data-model.md`, `research.md`, `contracts/` |
| 4. Tasks     | `/speckit.tasks`     | `specs/[feature]/tasks.md`                              |
| 5. Implement | `/speckit.implement` | código + stories + testes                               |
| 6. Validado  | —                    | todos os critérios de aceite do `spec.md` conferidos    |

Depois do Implement, confirme os gates da Constituição antes de marcar "Validado":

- [ ] Stories no Storybook para todo componente novo (Princípio IV)
- [ ] Interaction tests para componentes obrigatórios: `LogViewer`, `JsonViewer`,
      `EventTimeline`, `QueueReplayModal`, `RuntimeStatus` (Princípio VII)
- [ ] Testes de integração para Route Handlers críticos, usando `MiniStackProvider` (Princípio VIII)
- [ ] `turbo run build | lint | typecheck | test` passando

Respeite o grafo de dependências do roadmap — não inicie uma spec antes das suas dependências
estarem com status **Validado**.

**Legenda de status:** ⬜ Não iniciado · 🔄 Em andamento · ✅ Concluído · ⏸️ Bloqueado

**Ordem de prioridade de produto (após a Fundação):** Secrets Manager → S3 → Logs → SQS → SNS.

---

## Progresso Geral

| Sprint | Spec                              | Tema                              | Status | Dependências  |
| ------ | --------------------------------- | --------------------------------- | ------ | ------------- |
| 1      | [001](#001--monorepo-foundation)  | monorepo-foundation               | ✅     | —             |
| 1      | [002](#002--runtime-sdk)          | runtime-sdk                       | ⬜     | 001           |
| 1      | [003](#003--web-app-skeleton)     | web-app-skeleton                  | ⬜     | 001, 002      |
| 1      | [004](#004--storybook-foundation) | storybook-foundation              | ⬜     | 001           |
| 2      | [005](#005--secrets-manager)      | secrets-manager                   | ⬜     | 002, 003, 004 |
| 3      | [006](#006--s3-bucket-explorer)   | s3-bucket-explorer                | ⬜     | 002, 003, 004 |
| 4      | [007](#007--log-group-browser)    | log-group-browser                 | ⬜     | 002, 003, 004 |
| 4      | [008](#008--sse-log-streaming)    | sse-log-streaming                 | ⬜     | 002, 003, 007 |
| 4      | [009](#009--log-viewer-ui)        | log-viewer-ui                     | ⬜     | 004, 008      |
| 5      | [010](#010--sqs-queue-browser)    | sqs-queue-browser                 | ⬜     | 002, 003, 004 |
| 5      | [011](#011--dlq-replay)           | dlq-replay                        | ⬜     | 010           |
| 6      | [012](#012--sns-topic-browser)    | sns-topic-browser                 | ⬜     | 002, 003, 004 |
| 6      | [013](#013--event-timeline)       | event-timeline                    | ⬜     | 012, 008      |
| —      | [014](#014--public-docs-nextra)   | public-docs-nextra (independente) | ⬜     | 001           |

---

## Sprint 1 — Fundação

### 001 — monorepo-foundation

**Pasta:** `specs/001-monorepo-foundation/` · **Status:** ✅ Concluído · **Dependências:** nenhuma

**Fases**

- [x] Specify
- [x] Clarify
- [x] Plan
- [x] Tasks
- [x] Implement
- [x] Validado

**Entrega**

- [x] `turbo.json` + `pnpm-workspace.yaml` + `package.json` raiz
- [x] `packages/eslint-config` — regras TypeScript strict compartilhadas
- [x] `packages/shared` — tipos base compartilhados
- [x] Husky + Conventional Commits + lint-staged
- [x] Pipeline `turbo run build | lint | typecheck | test` (+ auditoria de dependências bloqueante)

---

### 002 — runtime-sdk

**Pasta:** `specs/002-runtime-sdk/` · **Status:** ⬜ Não iniciado · **Dependências:** 001

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `packages/runtime-sdk` com interface `RuntimeProvider`
- [ ] `MiniStackProvider` conectando ao MiniStack via AWS SDK v3
- [ ] `docker-compose.ministack.yml` com setup em < 2 minutos (caminho principal)
- [ ] `docker-compose.localstack.yml` como exemplo/testes, em container isolado
- [ ] Testes de integração do SDK usando MiniStack

---

### 003 — web-app-skeleton

**Pasta:** `specs/003-web-app-skeleton/` · **Status:** ⬜ Não iniciado · **Dependências:** 001, 002

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `apps/web` com App Router Next.js 15
- [ ] Estrutura: `app/`, `components/`, `hooks/`, `services/`, `providers/`, `store/`, `styles/`
- [ ] Layout base com navegação de 2 níveis
- [ ] TanStack Query provider + Zustand store vazio
- [ ] Busca global (estrutura, sem dados ainda)
- [ ] Página de status do runtime (`RuntimeStatus` em uso)

---

### 004 — storybook-foundation

**Pasta:** `specs/004-storybook-foundation/` · **Status:** ⬜ Não iniciado · **Dependências:** 001

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `apps/storybook` configurado com Tailwind + shadcn/ui
- [ ] Primitivos: `Button`, `Card`, `Badge`, `Spinner`, `EmptyState`, `ErrorState`
- [ ] `RuntimeStatus` — indicador de conexão com runtime (MiniStack/LocalStack/AWS)
- [ ] Stories para todos os primitivos com loading + error states
- [ ] Interaction tests para `RuntimeStatus`

---

## Sprint 2 — Secrets Manager

### 005 — secrets-manager

**Pasta:** `specs/005-secrets-manager/` · **Status:** ⬜ Não iniciado · **Dependências:** 002, 003, 004

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handlers: `GET/POST/PUT/DELETE /api/secrets`
- [ ] Listagem com valor mascarado (reveal on click)
- [ ] Criação e edição com validação
- [ ] Integração com `RuntimeStatus` (secrets dependem do runtime ativo)

> Sem histórico de versões — fora de escopo (não suportado no runtime local).

---

## Sprint 3 — S3

### 006 — s3-bucket-explorer

**Pasta:** `specs/006-s3-bucket-explorer/` · **Status:** ⬜ Não iniciado · **Dependências:** 002, 003, 004

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handlers: `GET /api/buckets`, `GET /api/buckets/:name/objects`, `GET /api/buckets/:name/objects/:key`
- [ ] Navegação por prefixo (pseudo-diretórios)
- [ ] Preview: texto, JSON (via `JsonViewer`), imagem
- [ ] Download de objeto
- [ ] Busca global integrada com objetos S3

---

## Sprint 4 — Logs (CloudWatch)

### 007 — log-group-browser

**Pasta:** `specs/007-log-group-browser/` · **Status:** ⬜ Não iniciado · **Dependências:** 002, 003, 004

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handlers: `GET /api/logs/groups`, `GET /api/logs/groups/:name/streams`
- [ ] `LogGroupCard` — card com nome do grupo, serviço associado, contagem de streams, retenção
- [ ] Página de log groups com busca global integrada
- [ ] Seleção de grupo/stream como ponto de entrada para o streaming SSE (spec 008)
- [ ] Stories e interaction tests para `LogGroupCard`

---

### 008 — sse-log-streaming

**Pasta:** `specs/008-sse-log-streaming/` · **Status:** ⬜ Não iniciado · **Dependências:** 002, 003, 007

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handler SSE: `GET /api/logs/stream` (parametrizado por grupo/stream selecionado em 007)
- [ ] `packages/log-engine`: parsing, correlation, filtering, formatting
- [ ] Reconexão automática com backoff, heartbeat, pause/resume
- [ ] Correlação de logs por `requestId`, `traceId`, `serviceId`
- [ ] Testes de integração do endpoint SSE com MiniStackProvider

---

### 009 — log-viewer-ui

**Pasta:** `specs/009-log-viewer-ui/` · **Status:** ⬜ Não iniciado · **Dependências:** 004, 008

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `LogViewer`: stream ao vivo, auto-scroll, pause, clear, highlight por nível
- [ ] `JsonViewer`: collapse/expand, syntax highlight, cópia de valores
- [ ] Filtros: nível (INFO/WARN/ERROR), serviço, texto livre
- [ ] `packages/ui`: `LogViewer`, `JsonViewer` exportados
- [ ] Stories e interaction tests obrigatórios para ambos
- [ ] Integração com `GET /api/logs/stream` em `apps/web`

---

## Sprint 5 — Queue Debugging (SQS)

### 010 — sqs-queue-browser

**Pasta:** `specs/010-sqs-queue-browser/` · **Status:** ⬜ Não iniciado · **Dependências:** 002, 003, 004

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handlers: `GET /api/queues`, `GET /api/queues/:name/messages`
- [ ] `QueueCard` — card com nome, contagem, status, tipo (padrão/DLQ/FIFO)
- [ ] Página de filas com busca global integrada
- [ ] Visualização de payload de mensagem via `JsonViewer`
- [ ] Stories e interaction tests para `QueueCard`

---

### 011 — dlq-replay

**Pasta:** `specs/011-dlq-replay/` · **Status:** ⬜ Não iniciado · **Dependências:** 010

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handlers: `POST /api/queues/:name/replay`, `DELETE /api/queues/:name/messages/:id`
- [ ] `QueueReplayModal` — seleção de mensagens, preview de payload, confirmação
- [ ] `packages/event-engine`: registro de replay como evento rastreável
- [ ] Histórico de replays com status (sucesso/falha)
- [ ] Stories e interaction tests para `QueueReplayModal`

---

## Sprint 6 — SNS Flow

### 012 — sns-topic-browser

**Pasta:** `specs/012-sns-topic-browser/` · **Status:** ⬜ Não iniciado · **Dependências:** 002, 003, 004

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] Route Handlers: `GET /api/topics`, `GET /api/topics/:name/subscriptions`, `POST /api/topics/:name/publish`
- [ ] Página de tópicos com subscribers expandíveis
- [ ] Formulário de publish manual com validação de payload JSON
- [ ] `packages/event-engine`: ingestão de eventos SNS

---

### 013 — event-timeline

**Pasta:** `specs/013-event-timeline/` · **Status:** ⬜ Não iniciado · **Dependências:** 012, 008 (SSE)

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `EventTimeline` — linha do tempo com eventos, timestamps, correlação de IDs
- [ ] Navegação por correlation ID (clicar em ID abre contexto relacionado)
- [ ] `packages/event-engine`: replay, correlação entre eventos SNS e mensagens SQS
- [ ] Route Handler: `GET /api/events/stream` (SSE)
- [ ] Stories e interaction tests para `EventTimeline`

---

## Documentação Pública (independente)

### 014 — public-docs-nextra

**Pasta:** `specs/014-public-docs-nextra/` · **Status:** ⬜ Não iniciado · **Dependências:** 001

**Fases**

- [ ] Specify
- [ ] Clarify
- [ ] Plan
- [ ] Tasks
- [ ] Implement
- [ ] Validado

**Entrega**

- [ ] `apps/docs` configurado com Nextra
- [ ] Estrutura de navegação para arquitetura, runtime providers e specs
- [ ] Publicação de `docs/doc.md` e `docs/roadmap.md` como páginas navegáveis
- [ ] Pipeline de build incluído em `turbo run build`

---

## Registro de mudanças

| Data       | Mudança                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-07-09 | Documento criado a partir de `roadmap.md`                                                                                                                                                                                                                                                                                                                          |
| 2026-07-09 | Reordenado por prioridade de produto: Secrets Manager → S3 → Logs → SQS → SNS. Adicionada spec `007-log-group-browser` (novo escopo de browser de log groups estilo CloudWatch). Specs renumeradas 005–013.                                                                                                                                                        |
| 2026-07-09 | Respondidas dúvidas de projeto: confirmado CloudWatch Logs API real (spec 007); removido histórico de versões de secrets (005, fora de escopo); adicionado `docker-compose.localstack.yml` isolado (002); adicionada spec `014-public-docs-nextra` (independente); `LogGroupCard`/`QueueCard` promovidos a obrigatórios no Storybook (ver constitution.md v2.1.0). |
