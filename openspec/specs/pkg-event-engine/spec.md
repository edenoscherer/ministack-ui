# pkg-event-engine Specification

## Purpose

TBD - created by archiving change setup-monorepo-structure. Update Purpose after archive.

## Requirements

### Requirement: Módulo de event engine com API pública definida

`packages/event-engine` SHALL exportar via `src/index.ts`: `traceEvent`, `replayEvent`, `buildTimeline`, `linkPayload`. No scaffold, cada função SHALL ter assinatura TypeScript correta e implementação stub.

#### Scenario: API importável com tipos corretos

- **WHEN** código importa `import { traceEvent } from "@ministack-ui/event-engine"`
- **THEN** o TypeScript SHALL resolver os tipos sem erros

### Requirement: Tipo DistributedEvent definido

`packages/event-engine` SHALL exportar o tipo `DistributedEvent` com campos: `id: string`, `type: string`, `timestamp: Date`, `source: string`, `correlationId: string`, `payload: unknown`, `linkedEvents?: string[]`.

#### Scenario: Tipo DistributedEvent utilizável

- **WHEN** código declara uma variável do tipo `DistributedEvent`
- **THEN** o TypeScript SHALL aplicar checagem de tipos corretamente em todos os campos obrigatórios
