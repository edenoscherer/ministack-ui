## 1. Design System and Global Styles Integration

- [x] 1.1 Atualizar `apps/web/styles/globals.css` com as novas cores OKLCH, animações personalizadas e estilizações de scrollbar exportadas pelo Lovable
- [x] 1.2 Atualizar `apps/web/tailwind.config.ts` para mapear os novos tokens de cores (`primary-soft`, `warning-soft`, `info-soft`, `sidebar`, `sidebar-border`, `terminal`, etc.) and a animação `pulse-soft`
- [x] 1.3 Mapear as variáveis CSS e classes de tema globais no Storybook (`apps/storybook/.storybook`) para garantir consistência visual no ambiente isolado

## 2. Reusable UI Components Migration

- [x] 2.1 Migrar os componentes genéricos `MiniLineChart.tsx`, `StatusBadge.tsx` e `ServiceIcon.tsx` da pasta de exportação do Lovable para `packages/ui/src/components`
- [x] 2.2 Atualizar a exportação central em `packages/ui/src/index.ts` para disponibilizar os novos componentes aos demais workspaces do monorepo
- [x] 2.3 Criar Stories no Storybook para validar a renderização isolada de cada componente migrado (`MiniLineChart`, `StatusBadge` e `ServiceIcon`)

## 3. Web App Shell Integration

- [x] 3.1 Copiar o arquivo `AppShell.tsx` do Lovable para `apps/web/components/AppShell.tsx`
- [x] 3.2 Adaptar o roteamento do `AppShell.tsx` substituindo TanStack Router por `next/link` e o hook `usePathname` do `next/navigation` do Next.js
- [x] 3.3 Configurar o `AppShell` para envolver as páginas principais no layout raiz (`apps/web/app/layout.tsx`)

## 4. Main Dashboard Implementation

- [x] 4.1 Reestruturar o arquivo `apps/web/app/page.tsx` com a estrutura visual completa do painel do Lovable (KPI Cards, listagem de serviços, gráfico de carga e sidebar de traces recentes)
- [x] 4.2 Integrar a lista de serviços do painel com dados dinâmicos obtidos através do `@ministack-ui/runtime-sdk`
- [x] 4.3 Implementar a interatividade reativa dos filtros de tipo de serviço (All, Serverless, Messaging, Storage, Config)
- [x] 4.4 Implementar a interatividade do seletor de status de saúde operacional (All, Healthy, Warning, Offline)
- [x] 4.5 Implementar a busca textual reativa por nome de serviço de forma case-insensitive

## 5. Verification and Polishing

- [x] 5.1 Validar se todos os testes estáticos e verificações de tipagem passam com sucesso executando `turbo run typecheck`
- [x] 5.2 Garantir conformidade com os lints do monorepo executando `turbo run lint`
- [x] 5.3 Executar build de produção do dashboard Next.js para garantir que não há erros de compilação
