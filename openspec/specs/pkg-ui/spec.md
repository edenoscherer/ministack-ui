# pkg-ui Specification

## Purpose

TBD - created by archiving change setup-monorepo-structure. Update Purpose after archive.

## Requirements

### Requirement: Package exporta componentes com tipagem TypeScript

`packages/ui` SHALL exportar componentes React com TypeScript strict, via `src/index.ts`. O `package.json` SHALL declarar `exports` apontando para `./src/index.ts` e `peerDependencies` para React e React DOM.

#### Scenario: Import de componente em apps/web

- **WHEN** `apps/web` importa `import { Button } from "@ministack-ui/ui"`
- **THEN** o TypeScript SHALL resolver o tipo corretamente e o build SHALL suceder

### Requirement: Componentes placeholder criados

`packages/ui` SHALL ter arquivos placeholder para: `Button`, `LogViewer`, `JsonTree`, `EventTimeline`, `QueueCard`. Cada componente SHALL exportar uma função React válida, mesmo que com implementação mínima.

#### Scenario: Todos os componentes importáveis

- **WHEN** um arquivo importa todos os componentes de `@ministack-ui/ui`
- **THEN** o TypeScript SHALL resolver todos os exports sem erros

### Requirement: Tailwind como peer dependency

`packages/ui` SHALL declarar Tailwind CSS como peer dependency e documentar que o consumer é responsável por incluir o path do package na configuração `content` do Tailwind.

#### Scenario: Estilos aplicados no consumer

- **WHEN** `apps/web` inclui `./node_modules/@ministack-ui/ui/src/**/*.{ts,tsx}` no Tailwind content
- **THEN** as classes Tailwind dos componentes SHALL ser geradas corretamente no bundle CSS
