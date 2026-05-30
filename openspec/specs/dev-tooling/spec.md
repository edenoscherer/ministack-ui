# dev-tooling Specification

## Purpose

TBD - created by archiving change setup-monorepo-structure. Update Purpose after archive.

## Requirements

### Requirement: Husky configurado com hooks pre-commit e commit-msg

O repositório SHALL ter Husky instalado com dois hooks ativos: `pre-commit` executando `pnpm lint-staged` e `commit-msg` validando a mensagem com `commitlint`.

#### Scenario: Commit com mensagem inválida bloqueado

- **WHEN** o desenvolvedor tenta fazer commit com mensagem `"fix stuff"`
- **THEN** o hook `commit-msg` SHALL rejeitar o commit com mensagem de erro indicando formato inválido

#### Scenario: Commit com mensagem válida aceito

- **WHEN** o desenvolvedor faz commit com mensagem `"feat(web): add runtime status component"`
- **THEN** o hook `commit-msg` SHALL aceitar o commit sem erros

### Requirement: lint-staged configurado para TypeScript e formatação

O `lint-staged` SHALL executar `eslint --fix` e `prettier --write` nos arquivos staged de extensões `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`.

#### Scenario: Arquivo formatado antes do commit

- **WHEN** o desenvolvedor faz stage de um arquivo `.ts` com formatação inconsistente e executa commit
- **THEN** o Prettier SHALL corrigir a formatação automaticamente antes do commit completar

### Requirement: commitlint com Conventional Commits

O `commitlint.config.ts` SHALL usar `@commitlint/config-conventional` como configuração base, exigindo o formato `<type>(<scope>): <description>`.

#### Scenario: Tipos de commit válidos reconhecidos

- **WHEN** o desenvolvedor usa tipo `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `ci`, `perf` ou `style`
- **THEN** o commitlint SHALL aceitar a mensagem

### Requirement: .nvmrc e .node-version declarados

O repositório SHALL ter `.nvmrc` (e opcionalmente `.node-version`) com a versão LTS do Node.js em uso, garantindo consistência entre desenvolvedores.

#### Scenario: nvm usa a versão correta

- **WHEN** o desenvolvedor executa `nvm use` na raiz do projeto
- **THEN** o nvm SHALL mudar para a versão Node declarada no `.nvmrc`

### Requirement: .gitignore abrangente

O `.gitignore` SHALL ignorar: `node_modules/`, `.turbo/`, `.next/`, `dist/`, `.storybook-out/`, arquivos `.env*` (exceto `.env.example`), e artefatos de IDE.

#### Scenario: Arquivos sensíveis não rastreados

- **WHEN** o desenvolvedor cria um arquivo `.env.local` na raiz
- **THEN** o git NÃO SHALL incluir esse arquivo em `git status` como untracked
