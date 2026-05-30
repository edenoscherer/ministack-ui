# monorepo-workspace Specification

## Purpose

TBD - created by archiving change setup-monorepo-structure. Update Purpose after archive.

## Requirements

### Requirement: Turborepo pipeline configurado

O monorepo SHALL ter um `turbo.json` na raiz com pipelines definidas para `build`, `dev`, `lint` e `test`. Cada pipeline SHALL declarar corretamente `dependsOn` e `outputs` para que o cache funcione.

#### Scenario: Pipeline de build em cascata

- **WHEN** o desenvolvedor executa `pnpm build` na raiz
- **THEN** o Turborepo SHALL executar o build dos packages antes das apps, respeitando o grafo de dependências

#### Scenario: Cache de build

- **WHEN** o desenvolvedor executa `pnpm build` duas vezes sem alterar arquivos
- **THEN** o Turborepo SHALL usar o cache na segunda execução e exibir `>>> FULL TURBO`

### Requirement: pnpm workspaces declarados

O arquivo `pnpm-workspace.yaml` SHALL declarar `apps/*` e `packages/*` como workspaces.

#### Scenario: Instalação de dependências

- **WHEN** o desenvolvedor executa `pnpm install` na raiz
- **THEN** todas as dependências de todos os workspaces SHALL ser instaladas com links simbólicos corretos em `node_modules`

### Requirement: Root package.json com scripts globais

O `package.json` raiz SHALL definir scripts `dev`, `build`, `lint` e `test` que delegam ao Turborepo, e SHALL declarar `engines.node` e `engines.pnpm` com versões mínimas.

#### Scenario: Execução de script global

- **WHEN** o desenvolvedor executa `pnpm dev` na raiz
- **THEN** o Turborepo SHALL iniciar o modo dev em todos os workspaces que possuem script `dev`

### Requirement: tsconfig base na raiz

O arquivo `tsconfig.base.json` na raiz SHALL definir `strict: true`, `target: "ES2022"`, `moduleResolution: "bundler"` e paths de workspace. Todos os workspaces SHALL extender este arquivo.

#### Scenario: TypeScript strict ativo

- **WHEN** um desenvolvedor escreve código com `any` implícito em qualquer workspace
- **THEN** o TypeScript SHALL emitir erro de compilação

### Requirement: .npmrc configurado para pnpm

O arquivo `.npmrc` na raiz SHALL conter `shamefully-hoist=false` e `strict-peer-dependencies=false` para garantir comportamento correto do pnpm.

#### Scenario: Instalação sem phantom dependencies

- **WHEN** um workspace importa um pacote não declarado em seu `package.json`
- **THEN** o pnpm SHALL falhar na resolução, exibindo erro de dependência não declarada
