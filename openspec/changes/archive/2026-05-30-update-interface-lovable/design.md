## Context

O MiniStack UI possui um monorepo configurado com Next.js 15 na aplicação `apps/web`, além de um pacote central de UI em `packages/ui`. O visual atual da aplicação é extremamente simplista e carece de polimento de UX/UI. O Lovable gerou um conjunto de telas e componentes de alto padrão para a home e visualização de logs, utilizando TanStack Router no lado do cliente. Este documento descreve como essa interface rica será integrada de forma limpa, segura e de alto desempenho no ecossistema Next.js/Turborepo do projeto.

## Goals / Non-Goals

**Goals:**

- Integrar os novos estilos premium e o layout gerado pelo Lovable nas rotas principais do Next.js.
- Modularizar novos componentes reutilizáveis, extraindo-os para o pacote `@ministack-ui/ui`.
- Manter suporte completo para os modos claro e escuro usando o sistema de cores OKLCH definido no layout exportado.
- Adicionar capacidades completas de busca e filtros funcionais no painel de controle.

**Non-Goals:**

- Não migrar o Next.js para o TanStack Router. Toda a estrutura de roteamento baseada no Next.js App Router SHALL ser mantida.
- Não alterar as APIs backend, logs-SSE ou lógicas internas do Core Engine.

## Decisions

### 1. Adaptação do AppShell e Roteamento para Next.js App Router

- **Alternativa Considerada:** Usar TanStack Router no cliente Next.js.
- **Decisão:** Manter o Next.js App Router nativo e converter o `AppShell.tsx` do Lovable. Substituiremos o `import { Link } from "@tanstack/react-router"` pelo `import Link from "next/link"` do Next.js, e o hook `useRouterState` por `usePathname` do `next/navigation`.
- **Justificativa:** Menor complexidade, melhor suporte a Server Components/SSR do Next.js e manutenção da consistência técnica atual.

### 2. Organização e Distribuição dos Componentes Reutilizáveis

- **Alternativa Considerada:** Colocar todos os novos componentes dentro de `apps/web/components`.
- **Decisão:** Separar os componentes em dois níveis:
  - **Componentes Globais (`packages/ui`)**: `MiniLineChart.tsx`, `StatusBadge.tsx` e `ServiceIcon.tsx`. Eles serão exportados no index de `packages/ui`.
  - **Layout & Dashboard específicos (`apps/web`)**: `AppShell.tsx` (que possui lógica de workspace Next.js) e componentes internos de página ficarão localmente no app web.
- **Justificativa:** Promove o reaproveitamento de componentes no Storybook e futuras aplicações do monorepo, mantendo lógicas de rota e aplicação contidas no app correto.

### 3. Migração do Design System e Variáveis de Cores (OKLCH)

- **Alternativa Considerada:** Traduzir os valores OKLCH gerados pelo Lovable de volta para o formato HSL atual do tailwind.config.ts.
- **Decisão:** Adotar diretamente o sistema de cores OKLCH declarando os novos tokens em `apps/web/styles/globals.css` sob as variáveis de root/dark e atualizar `tailwind.config.ts` para mapear essas variáveis diretamente (sem wrappers `hsl()`).
- **Justificativa:** OKLCH fornece cores muito mais vibrantes, consistentes e modernas na tela, em perfeita consonância com o layout premium exportado.

## Risks / Trade-offs

- **[Risco] Incompatibilidade com Storybook** → Componentes em `packages/ui` que utilizam variáveis CSS sem definição padrão podem quebrar no Storybook.
  - _Mitigação_: Garantir que as variáveis de tema globais (como `--border`, `--background`, `--primary-soft`) sejam devidamente mapeadas no CSS do Storybook.
- **[Risco] Conflito de Componentes Existentes (JsonTree/LogViewer)** → O Lovable exportou implementações de `JsonTree` e visualizadores rápidos.
  - _Mitigação_: Manteremos e aprimoraremos as versões de produção de `JsonTree` e `LogViewer` já construídas no monorepo, apenas aplicando os estilos e classes de layout adequados para fundi-los com o novo design.
