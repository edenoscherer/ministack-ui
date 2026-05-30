# pkg-shared Specification

## Purpose

TBD - created by archiving change setup-monorepo-structure. Update Purpose after archive.

## Requirements

### Requirement: Package shared com tipos e utilitários base

`packages/shared` SHALL exportar via `src/index.ts` tipos compartilhados entre todos os workspaces: `ApiResponse<T>`, `PaginatedResponse<T>`, `ServiceStatus`, e a constante `RUNTIME_PROVIDERS`.

#### Scenario: Tipos importáveis em qualquer workspace

- **WHEN** `apps/web` ou qualquer `packages/*` importa `import type { ApiResponse } from "@ministack-ui/shared"`
- **THEN** o TypeScript SHALL resolver os tipos corretamente

### Requirement: ApiResponse tipada

`ApiResponse<T>` SHALL ter a forma: `{ data: T; error: null } | { data: null; error: { message: string; code: string } }`.

#### Scenario: Discriminated union funciona corretamente

- **WHEN** código verifica `if (response.error)` em uma `ApiResponse<T>`
- **THEN** o TypeScript SHALL narrowar corretamente o tipo dentro de cada branch

### Requirement: ServiceStatus definido

`ServiceStatus` SHALL ser um enum ou union type com valores: `"healthy"`, `"degraded"`, `"unavailable"`.

#### Scenario: ServiceStatus usado em componentes

- **WHEN** um componente recebe uma prop do tipo `ServiceStatus`
- **THEN** o TypeScript SHALL validar que apenas os valores permitidos são passados
