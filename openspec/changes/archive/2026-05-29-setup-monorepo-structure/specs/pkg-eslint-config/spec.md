## ADDED Requirements

### Requirement: Package eslint-config exporta configurações compartilhadas

`packages/eslint-config` SHALL exportar pelo menos três configurações: `base` (Node.js/TypeScript genérico), `next` (para apps Next.js), `react-internal` (para packages React). Cada configuração SHALL ser um arquivo `.js` ou `.mjs` exportando um flat config array compatível com ESLint v9.

#### Scenario: Configuração base consumida por package interno

- **WHEN** `packages/shared/eslint.config.mjs` estende `eslint-config-ministack-ui/base`
- **THEN** o ESLint SHALL aplicar as regras corretamente sem erros de configuração

#### Scenario: Configuração next consumida por apps/web

- **WHEN** `apps/web/eslint.config.mjs` estende `eslint-config-ministack-ui/next`
- **THEN** o ESLint SHALL incluir regras específicas de Next.js e React

### Requirement: Prettier integrado ao ESLint

A configuração base SHALL incluir `eslint-config-prettier` para desabilitar regras do ESLint conflitantes com Prettier. O arquivo `.prettierrc` SHALL estar na raiz com configurações compartilhadas.

#### Scenario: Sem conflitos Prettier-ESLint

- **WHEN** o desenvolvedor executa `pnpm lint` após formatar com Prettier
- **THEN** o ESLint NÃO SHALL reportar erros de formatação

### Requirement: Regra anti-AWS SDK no frontend

A configuração `next` SHALL incluir regra `no-restricted-imports` bloqueando imports de `@aws-sdk/*` em arquivos fora de `app/api/**` e `services/`.

#### Scenario: Import AWS SDK bloqueado em componente

- **WHEN** um arquivo `components/MyComponent.tsx` importa `@aws-sdk/client-sqs`
- **THEN** o ESLint SHALL reportar erro `no-restricted-imports`
