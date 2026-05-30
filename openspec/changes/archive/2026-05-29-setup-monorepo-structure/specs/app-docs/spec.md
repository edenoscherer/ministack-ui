## ADDED Requirements

### Requirement: Aplicação Nextra configurada

`apps/docs` SHALL ser uma aplicação Next.js com Nextra v2 configurado, tema `nextra-theme-docs`, com navegação lateral e busca integrada.

#### Scenario: Documentação inicia sem erros

- **WHEN** o desenvolvedor executa `pnpm dev` dentro de `apps/docs`
- **THEN** o Nextra SHALL iniciar e exibir a página inicial da documentação

### Requirement: Página inicial de documentação

`apps/docs` SHALL conter uma página `index.mdx` com introdução ao projeto ministack-ui, descrevendo o objetivo da plataforma.

#### Scenario: Página inicial acessível

- **WHEN** o usuário acessa `http://localhost:3001`
- **THEN** a página SHALL exibir o título e descrição do projeto
