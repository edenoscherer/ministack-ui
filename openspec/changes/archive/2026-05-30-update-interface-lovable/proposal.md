## Why

O layout e os componentes visuais atuais do MiniStack UI são simplistas e não refletem a experiência premium de um "Runtime Inspector" de alta performance. A exportação gerada pelo Lovable traz uma interface moderna, rica em detalhes e altamente usável, com dashboards de status de serviços, gráficos rápidos de carga e rastreamento de traces. Integrar este novo design polido ao monorepo melhora significativamente a usabilidade e a estética visual do projeto.

## What Changes

- **Integração do Dashboard Principal**: Atualização completa de `apps/web/app/page.tsx` para refletir o design de alta fidelidade gerado pelo Lovable (KPI Cards, listagem avançada de serviços AWS com busca e filtros, gráfico de carga e visualizador de traces recentes).
- **Abstração de Componentes Reutilizáveis**: Migração de novos componentes visuais para `@ministack-ui/ui` e `apps/web/components`, como `AppShell`, `MiniLineChart`, `ServiceIcon`, `StatusBadge` e refinamento do `JsonTree` se necessário.
- **Design System & Estilização Premium**: Atualização das configurações de Tailwind CSS (`tailwind.config.ts`) e estilos globais (`styles/globals.css`) em `apps/web` e `packages/ui` para suportar o novo esquema de cores escuras premium, gradientes suaves e micro-animações do Lovable.
- **Interatividade nos Filtros**: Implementação da lógica de filtragem de serviços em tempo real por tipo (Serverless, Messaging, Storage, Config) e por status (Healthy, Warning, Offline).

## Capabilities

### New Capabilities

- `dashboard-service-filtering`: Busca global e filtragem multidimensional de serviços locais (por tipo de serviço AWS e por estado de saúde de runtime).

### Modified Capabilities

Nenhuma capability existente terá seus requisitos de negócio alterados.

## Impact

- `@ministack-ui/web` (`apps/web`): Atualização da página inicial, estilos globais e componentes de layout.
- `@ministack-ui/ui` (`packages/ui`): Adição de componentes genéricos reutilizáveis para compatibilidade com o Storybook.
- Estilos Globais: Adição de utilitários de animação (como `pulse-soft`), cores e variáveis do tema escuro premium.

## Fora do Escopo (Non-Goals)

- Não será alterada a lógica de stream de logs do SSE no backend.
- Não será implementado suporte real a contas AWS em produção neste incremento.
- Não serão recriados ou alterados os motores internos de eventos (`event-engine`) ou parsing de logs (`log-engine`).
