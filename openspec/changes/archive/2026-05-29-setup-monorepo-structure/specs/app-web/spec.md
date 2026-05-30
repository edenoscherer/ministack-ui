## ADDED Requirements

### Requirement: Scaffold Next.js 15 com App Router

`apps/web` SHALL ser uma aplicação Next.js 15 usando App Router, com TypeScript strict, Tailwind CSS configurado e `next.config.ts` apontando para transpilePackages dos packages internos.

#### Scenario: Inicialização do servidor de desenvolvimento

- **WHEN** o desenvolvedor executa `pnpm dev` dentro de `apps/web`
- **THEN** o Next.js SHALL iniciar em `http://localhost:3000` sem erros de compilação

#### Scenario: Transpilação de packages internos

- **WHEN** `apps/web` importa um componente de `@ministack-ui/ui`
- **THEN** o Next.js SHALL transpilar o package interno corretamente, sem erros de módulo

### Requirement: Estrutura de diretórios definida

`apps/web` SHALL ter a seguinte estrutura: `app/` (rotas), `components/` (componentes locais), `hooks/` (custom hooks), `services/` (chamadas de API), `providers/` (context providers), `store/` (Zustand stores), `styles/` (CSS global). Cada diretório SHALL ter um arquivo `index.ts` ou arquivo inicial.

#### Scenario: Diretórios presentes após scaffold

- **WHEN** o scaffold é aplicado
- **THEN** todos os diretórios SHALL existir com pelo menos um arquivo placeholder

### Requirement: TanStack Query e Zustand configurados

`apps/web` SHALL ter `QueryClientProvider` (TanStack Query v5) e Zustand disponíveis como providers. O `QueryClient` SHALL ser instanciado no provider raiz.

#### Scenario: Provider raiz funcional

- **WHEN** a aplicação é carregada no browser
- **THEN** o `QueryClientProvider` SHALL envolver toda a árvore de componentes sem erros

### Requirement: shadcn/ui inicializado

`apps/web` SHALL ter o shadcn/ui inicializado com `components.json`, paleta de cores configurada e pelo menos o componente `Button` adicionado.

#### Scenario: Componente shadcn disponível

- **WHEN** um componente importa `@/components/ui/button`
- **THEN** o import SHALL resolver corretamente e o componente SHALL renderizar

### Requirement: Frontend não acessa AWS diretamente

Nenhum arquivo em `apps/web` SHALL importar `@aws-sdk/*` diretamente. Toda comunicação com serviços AWS SHALL passar pelos Route Handlers da própria aplicação.

#### Scenario: Violação de regra detectada pelo lint

- **WHEN** um desenvolvedor importa `@aws-sdk/client-sqs` em um componente React
- **THEN** o ESLint SHALL emitir erro indicando violação da regra de arquitetura
