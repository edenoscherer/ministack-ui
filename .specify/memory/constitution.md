<!--
SYNC IMPACT REPORT
==================
Versão: (nenhuma) → 1.0.0
Tipo de bump: MAJOR — primeira ratificação desta constituição sobre o código real de `main`.

Contexto: uma tentativa anterior de constituição (v2.1.0) foi escrita em uma branch
(`docs/migrate-to-spec-kit`) cortada do commit inicial do repositório, antes do monorepo real
ter sido construído via OpenSpec (PRs #1–#4). Aquela versão continha suposições incorretas sobre
nomes de componentes (`JsonViewer` em vez do real `JsonTree`, um `LogGroupCard` inexistente) e
sobre a interface `RuntimeProvider` (inventada, divergente da real). Esta v1.0.0 substitui aquela
tentativa, ratificada diretamente sobre o estado real de `main`.

Princípios: 8 princípios definidos (SDD, Abstração de Runtime, Streaming-First, UI-First no
Storybook, UX Workflow-First, TypeScript Strict e Linting, Testes de Componente, Testes de
Integração) — mesmo espírito da tentativa anterior, componentes e interface corrigidos para
refletir o código real.

Templates atualizados:
  ✅ .specify/templates/plan-template.md — Constitution Check gates já genéricos, sem alteração necessária
  ✅ .specify/templates/spec-template.md — agnóstico de stack, sem alteração necessária
  ✅ .specify/templates/tasks-template.md — já referencia Princípios VII/VIII genericamente

TODOs pendentes: nenhum
-->

# MiniStack UI — Constituição

## Princípios Fundamentais

### I. Spec-Driven Development (SDD)

Toda implementação nova DEVE nascer de uma spec. Código não é source of truth — specs são.

- Uma feature nova DEVE ter `spec.md`, `plan.md` e `tasks.md` com critérios de aceite definidos
  antes de qualquer linha de código ser escrita.
- As fases DEVEM ser executadas em ordem: Constitution → Specify → Clarify → Plan → Tasks → Implement.
- Os artefatos de spec residem em `specs/[feature-name]/` e NÃO DEVEM ser deletados ou contornados.
- `/speckit.clarify` DEVE ser utilizado para resolver ambiguidades antes que `/speckit.plan` avance.
- O trabalho já implementado antes desta constituição (setup do monorepo, packages base,
  streaming de logs, descoberta de log groups/streams) foi conduzido via **OpenSpec**
  (`openspec/specs/`, `openspec/changes/archive/`) e permanece válido como registro histórico —
  não deve ser reescrito retroativamente como spec Spec Kit. Toda feature **nova** a partir desta
  ratificação segue Spec Kit.

### II. Abstração de Runtime

O frontend NUNCA DEVE importar AWS SDK nem comunicar diretamente com qualquer runtime de nuvem.

- Todo acesso a runtime DEVE seguir o fluxo: `apps/web` → Route Handlers → `packages/runtime-sdk`.
- `packages/runtime-sdk` DEVE expor apenas a interface `RuntimeProvider`. As implementações
  (`MiniStackProvider`, `LocalStackProvider`, `AwsProvider`) são intercambiáveis sem qualquer
  alteração no código de UI.
- Lógica específica de runtime NÃO É PERMITIDA dentro de componentes React ou em `packages/ui`.
- Novos recursos de runtime (buckets S3, filas SQS reais, tópicos SNS reais, secrets reais) DEVEM
  ser adicionados à interface `RuntimeProvider` e implementados em todos os providers antes de
  qualquer Route Handler consumi-los — métodos-esqueleto que lançam `not implemented` (como
  `queues()`, `topics()`, `secrets()` hoje) NÃO DEVEM ser expostos à UI até terem implementação
  real.

### III. Streaming-First

A plataforma NUNCA DEVE exigir refresh manual de página para refletir mudanças de estado do runtime.

- Todos os dados em tempo real (logs, mensagens de fila, eventos) DEVEM transmitir via SSE.
- Todo endpoint SSE DEVE implementar: reconnect, heartbeat, pause e auto-scroll.
- Polling NÃO É PERMITIDO como substituto para streaming.

### IV. UI-First no Storybook

Todo componente de UI DEVE ser construído e validado no Storybook antes de ser usado em `apps/web`.

- Um componente NÃO DEVE ser integrado a `apps/web` sem um arquivo `.stories.tsx` correspondente.
- Stories DEVEM cobrir: estado padrão, estado de loading e estado de erro, cada um com mock data próprio.
- Os seguintes componentes de `packages/ui` são permanentemente obrigatórios no Storybook:
  `LogViewer`, `JsonTree`, `EventTimeline`, `QueueCard` (já existem — `EventTimeline` e
  `QueueCard` ainda sem story, ver dívida técnica abaixo) e `QueueReplayModal` (a construir junto
  da spec de DLQ replay).
- Novos componentes de destaque de features futuras (ex: tabela/browser de log groups,
  indicador de status do runtime) entram nesta lista permanente assim que sua spec for
  implementada — nenhuma spec de UI crítica encerra sem atualizar esta lista.

### V. UX Workflow-First

A UX DEVE guiar o usuário por fluxos operacionais, não expor listas de recursos para CRUD.

- A profundidade de navegação NÃO DEVE exceder 2 níveis.
- Todos os recursos DEVEM ser acessíveis via busca global.
- IDs de correlação DEVEM ser navegáveis entre serviços (clicar em um ID navega para seu contexto).
- O fluxo primário do usuário é: `Logs → Evento → Debugging`, nunca `Recursos → CRUD`.

### VI. TypeScript Strict e Linting

Todo código DEVE passar pelos gates de qualidade automatizados antes de ser integrado.

- TypeScript strict mode DEVE estar habilitado em todos os packages e apps.
- ESLint + Prettier DEVEM ser aplicados. Nenhum erro de lint é permitido no merge.
- Hooks Husky de pre-commit DEVEM executar linting e type-checking.
- Todos os commits DEVEM seguir o formato Conventional Commits.

### VII. Testes de Componente

Todo componente de UI crítico (lista do Princípio IV) DEVE ter testes de interação no Storybook.

- Interaction tests (via `@storybook/test`) DEVEM cobrir os fluxos principais de cada componente obrigatório.
- Testes DEVEM ser escritos antes da implementação (test-first quando aplicável).
- Uma story sem teste de interação NÃO É PERMITIDA para os componentes listados no Princípio IV.
- Testes de componente NÃO DEVEM depender de estado global nem de chamadas de rede reais —
  usar mock data definida na própria story.
- Dívida técnica atual (a resolver antes ou junto da próxima spec que tocar esses componentes):
  `EventTimeline` e `QueueCard` ainda não têm `.stories.tsx`.

### VIII. Testes de Integração

Fluxos críticos entre `apps/web`, Route Handlers e `packages/runtime-sdk` DEVEM ser cobertos
por testes de integração.

- Contratos de API (payloads de request/response) DEVEM ter testes de contrato em `specs/[feature]/contracts/`.
- Route Handlers que comunicam com `runtime-sdk` DEVEM ter testes de integração usando
  `MiniStackProvider` como runtime padrão de teste.
- Testes de integração DEVEM rodar em CI e NUNCA ser ignorados para merge em `main`.
- Dependências externas (AWS real, LocalStack) DEVEM ser mockadas nos testes de integração —
  use `MiniStackProvider` ou mocks explícitos.

## Restrições de Stack

As seguintes escolhas são fixas e NÃO DEVEM ser substituídas sem um ADR correspondente em `adr/`:

| Camada                 | Tecnologia                                       |
| ---------------------- | ------------------------------------------------ |
| Monorepo               | Turborepo + pnpm workspaces                      |
| Frontend               | Next.js 15 (App Router)                          |
| UI                     | Tailwind CSS + shadcn/ui                         |
| API                    | Next.js Route Handlers                           |
| Runtime SDK            | AWS SDK v3 (exclusivo em `packages/runtime-sdk`) |
| Realtime               | SSE                                              |
| Componentes            | Storybook                                        |
| Testes de componente   | Storybook Interaction Tests (`@storybook/test`)  |
| Testes de integração   | Vitest                                           |
| SDD (features novas)   | Spec Kit                                         |
| Histórico pré-Spec-Kit | OpenSpec (`openspec/`, ver Princípio I)          |
| Docs públicos          | Nextra (`apps/docs`)                             |
| ADRs                   | Markdown em `adr/`                               |

Mudanças de tecnologia exigem um ADR aprovado em `adr/` antes da implementação.

## Fluxo de Desenvolvimento SDD

Toda feature nova segue esta sequência sem exceção:

1. `/speckit.constitution` — verificar ou atualizar este arquivo antes de iniciar
2. `/speckit.specify` → `specs/[feature]/spec.md`
3. `/speckit.clarify` — resolver ambiguidades
4. `/speckit.plan` → `plan.md`, `data-model.md`, `research.md`, `contracts/`
5. `/speckit.tasks` → `specs/[feature]/tasks.md`
6. `/speckit.implement` — executar tarefas
7. Criar stories no Storybook para todos os novos componentes de UI
8. Escrever interaction tests para componentes obrigatórios (Princípio VII)
9. Escrever testes de integração para Route Handlers críticos (Princípio VIII)
10. Validar todos os critérios de aceite definidos em `spec.md`

Hooks git em `.specify/extensions.yml` fazem auto-commit a cada fase.

## Governança

- Esta constituição substitui todas as outras práticas de desenvolvimento e acordos informais
  para features **novas**. O histórico já implementado via OpenSpec permanece registrado em
  `openspec/` e não é retroativamente reescrito (Princípio I).
- Toda emenda DEVE incrementar a versão seguindo semver:
  MAJOR para remoção/redefinição de princípios, MINOR para adições, PATCH para clarificações.
- Todos os PRs DEVEM ser verificados quanto à conformidade com estes princípios na revisão.
- Violações de complexidade DEVEM ser documentadas em um ADR correspondente antes do merge.
- Para guia de desenvolvimento em tempo de execução, consulte `CLAUDE.md` e `docs/doc.md`.

**Versão**: 1.0.0 | **Ratificada**: 2026-07-09 | **Última emenda**: 2026-07-09
