## Why

O MiniStack UI possui dois tipos distintos de logs que servem propósitos diferentes:

1. **Logs de serviços MiniStack** — logs em tempo real emitidos pelos serviços da plataforma (Lambda, ECS, API Gateway etc.), visualizados na página `/logs` com streaming via SSE e filtros de Log Group/Stream. Esta experiência está implementada e funcionando.

2. **Logs de CloudWatch Log Groups** — a visão administrativa dos grupos de logs, modelada fielmente ao **Amazon CloudWatch Logs**, onde o usuário vê os Log Groups como entidades gerenciáveis com metadados (nome, retenção, tamanho armazenado), podendo criar e deletar grupos, e acessar os logs de cada grupo individualmente.

A página `/logs` atual não será modificada. Esta mudança é **puramente aditiva**: entrega uma nova seção dedicada de gerenciamento de Log Groups sem tocar no streaming de serviços existente.

## What Changes

- **Novo tipo `LogGroupMetadata`** em `@ministack-ui/shared` com campos `name`, `retentionDays`, `storedBytes`, `createdAt`.
- **Novo método `getLogGroupsWithMetadata()`** no `RuntimeProvider` (sem alterar `getLogGroups()` existente para preservar retrocompatibilidade com o `LogViewer`).
- **Novo método `createLogGroup()`** e **`deleteLogGroup()`** no `RuntimeProvider`.
- **Novos endpoints de API**:
  - `GET /api/cloudwatch/log-groups` — retorna `LogGroupMetadata[]`.
  - `POST /api/cloudwatch/log-groups` — cria um novo Log Group.
  - `DELETE /api/cloudwatch/log-groups` — deleta um Log Group por nome.
- **Novo componente `LogGroupsTable`** em `@ministack-ui/ui`, com Story no Storybook.
- **Nova página `/cloudwatch/logs`** com tabela de Log Groups, botão "Create Log Group" e ações por linha (View Logs, Delete).
- **Navegação atualizada** para incluir link "CloudWatch Logs" no layout da aplicação.

## Capabilities

### New Capabilities

- `cloudwatch-log-groups-management`: Gerenciamento de Log Groups com visualização de metadados, criação e deleção, fiel ao modelo do Amazon CloudWatch Logs.

### Modified Capabilities

- Nenhuma capability existente é modificada. A mudança é estritamente aditiva.

## Impact

- `@ministack-ui/shared`: Novo tipo `LogGroupMetadata` (adição, sem remoção).
- `@ministack-ui/runtime-sdk`: Novos métodos `getLogGroupsWithMetadata`, `createLogGroup`, `deleteLogGroup` na interface `RuntimeProvider`. O método `getLogGroups(): Promise<string[]>` permanece inalterado.
- `@ministack-ui/ui`: Novo componente `LogGroupsTable` com Story.
- `apps/web`: Novas rotas `/api/cloudwatch/log-groups` e nova página `/cloudwatch/logs`. Layout de navegação atualizado com novo link.
- `apps/web/app/logs/page.tsx`: **NÃO modificado.**
- `apps/web/store/useLogStore.ts`: **NÃO modificado.**

## Non-Goals (Fora do Escopo)

- Modificação da página `/logs` existente ou do streaming de serviços MiniStack.
- Edição de retenção de Log Groups existentes via UI nesta sprint.
- Visualização inline de Log Streams dentro desta página (o usuário clica "View Logs" e vai para `/logs` com o grupo pré-selecionado).
- Persistência real de grupos criados entre reinicializações do servidor (mock em memória).
- Paginação server-side de Log Groups.
