# pkg-runtime-sdk Specification

## Purpose

TBD - created by archiving change setup-monorepo-structure. Update Purpose after archive.

## Requirements

### Requirement: Interface RuntimeProvider definida

`packages/runtime-sdk` SHALL exportar a interface `RuntimeProvider` com os métodos: `logs(): Promise<void>`, `queues(): Promise<void>`, `topics(): Promise<void>`, `secrets(): Promise<void>`.

#### Scenario: Interface importável e compilável

- **WHEN** um arquivo importa `import type { RuntimeProvider } from "@ministack-ui/runtime-sdk"`
- **THEN** o TypeScript SHALL resolver a interface sem erros

### Requirement: Providers concretos com scaffold

`packages/runtime-sdk` SHALL exportar classes `MiniStackProvider`, `LocalStackProvider` e `AwsProvider`, todas implementando `RuntimeProvider`. No scaffold, cada método SHALL lançar `new Error("not implemented")`.

#### Scenario: Provider instanciável

- **WHEN** código instancia `new MiniStackProvider()`
- **THEN** o TypeScript SHALL aceitar o tipo como `RuntimeProvider` sem erros de tipo

### Requirement: AWS SDK v3 como dependência

`packages/runtime-sdk` SHALL declarar `@aws-sdk/client-sqs`, `@aws-sdk/client-sns`, `@aws-sdk/client-secrets-manager` e `@aws-sdk/client-s3` como dependências.

#### Scenario: Imports do AWS SDK disponíveis

- **WHEN** um provider importa um client do AWS SDK v3
- **THEN** o import SHALL resolver corretamente em tempo de compilação e execução
