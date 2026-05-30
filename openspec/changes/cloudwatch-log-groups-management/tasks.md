## 0. Setup

- [x] 0.1 Criar branch `feat/cloudwatch-log-groups-management` a partir de `main`.

## 1. Shared Types (`@ministack-ui/shared`)

- [x] 1.1 Adicionar o tipo `LogGroupMetadata` em `packages/shared/src/types.ts` com campos: `name: string`, `retentionDays: number | null`, `storedBytes: number`, `createdAt: string`.
- [x] 1.2 Exportar `LogGroupMetadata` em `packages/shared/src/index.ts`.

## 2. Runtime SDK (`@ministack-ui/runtime-sdk`)

- [x] 2.1 Adicionar à interface `RuntimeProvider` em `packages/runtime-sdk/src/types.ts` os novos métodos: `getLogGroupsWithMetadata(): Promise<LogGroupMetadata[]>`, `createLogGroup(name: string, retentionDays?: number | null): Promise<LogGroupMetadata>`, `deleteLogGroup(name: string): Promise<void>`. O método `getLogGroups(): Promise<string[]>` **permanece inalterado**.
- [x] 2.2 Criar singleton de estado mock `let mockLogGroupsStore: LogGroupMetadata[]` no escopo de módulo de `packages/runtime-sdk/src/providers/MiniStackProvider.ts` com os grupos iniciais: `/demo-app/api` (7163136 bytes), `/ecs/demo-api` (1829918 bytes), `/ecs/demo-worker` (1159495 bytes), `/infra/ministack` (0 bytes) — todos com `retentionDays: null`.
- [x] 2.3 Implementar `getLogGroupsWithMetadata()`, `createLogGroup()` e `deleteLogGroup()` no `MiniStackProvider` operando sobre o singleton de estado.
- [x] 2.4 Criar singleton de estado mock equivalente no `LocalStackProvider` com grupos diferentes e realistas de ambiente LocalStack, e implementar os três novos métodos.
- [x] 2.5 Adicionar stubs para os três novos métodos no `AwsProvider` (lançar `Error('not implemented')` ou retornar array vazio).

## 3. API Route Handlers (`apps/web`)

- [x] 3.1 Criar `apps/web/app/api/cloudwatch/log-groups/route.ts` com handler `GET` que chama `provider.getLogGroupsWithMetadata()` e retorna `{ data: { groups: LogGroupMetadata[] }, error: null }`.
- [x] 3.2 Adicionar handler `POST` no mesmo arquivo para criar um Log Group. Body esperado: `{ name: string, retentionDays?: number | null, provider: string }`. Retorna o `LogGroupMetadata` criado com status `201`.
- [x] 3.3 Adicionar handler `DELETE` no mesmo arquivo para deletar um Log Group. Query params: `name` e `provider`. Retorna `204 No Content` em sucesso.

## 4. UI Component (`@ministack-ui/ui`)

- [x] 4.1 Criar `packages/ui/src/components/LogGroupsTable.tsx` com props: `groups: LogGroupMetadata[]`, `onDelete: (name: string) => void`, `onViewLogs: (name: string) => void`, `isLoading?: boolean`. Colunas: Name (badge monospace), Retention ("Never Expire" ou "N days"), Stored Size (formatado KB/MB), Actions (botões "View Logs" e "Delete").
- [x] 4.2 Criar `packages/ui/src/stories/LogGroupsTable.stories.tsx` com ao menos 2 histórias: com dados (grupos mockados) e estado de loading.
- [x] 4.3 Exportar `LogGroupsTable` em `packages/ui/src/index.ts`.

## 5. Página de Gerenciamento (`apps/web`)

- [x] 5.1 Criar `apps/web/app/cloudwatch/logs/page.tsx` com header "CloudWatch Logs", subtítulo "View and manage local application logs", seletor de provider (MiniStack/LocalStack), botão "Create Log Group" e `LogGroupsTable` integrada.
- [x] 5.2 Implementar fetch de dados com `useState` + `useEffect` + `fetch GET /api/cloudwatch/log-groups`. Exibir estado de loading na tabela durante o fetch.
- [x] 5.3 Implementar modal "Create Log Group" com campos `Name` (required) e `Retention (days)` (opcional). Submit chama `POST /api/cloudwatch/log-groups`, atualiza a lista localmente com o item retornado e fecha o modal.
- [x] 5.4 Implementar deleção: ao clicar "Delete" na tabela, exibir confirmação inline (ou toast de confirmação), chamar `DELETE /api/cloudwatch/log-groups?name=<name>&provider=<provider>` e remover o item da lista localmente.
- [x] 5.5 Implementar o botão "View Logs": navegar para `/logs?logGroup=<name>` usando `next/navigation`.

## 6. Leitura de Query Param na Página `/logs` (mínima)

- [x] 6.1 Em `apps/web/app/logs/page.tsx`, adicionar leitura de `useSearchParams()` na montagem do componente para pré-selecionar o `logGroup` quando o query param `?logGroup=<name>` estiver presente. Nenhuma outra alteração neste arquivo.

## 7. Navegação

- [x] 7.1 Atualizar o layout/componente de navegação em `apps/web` para incluir link "CloudWatch Logs" apontando para `/cloudwatch/logs`, consistente visualmente com os demais itens de menu.

## 8. Commits e Pull Request

- [x] 8.1 Verificar que `pnpm typecheck` e `pnpm lint` passam sem erros.
- [ ] 8.2 Criar commit com mensagem `feat(cloudwatch): add log groups management page` cobrindo todas as alterações.
- [ ] 8.3 Criar Pull Request na branch `feat/cloudwatch-log-groups-management` → `main` com título `feat(cloudwatch): add CloudWatch Log Groups management page` e descrição resumindo as capabilities adicionadas, workspaces afetados e link para o change `openspec/changes/cloudwatch-log-groups-management/`.
