## Context

O MiniStack UI possui dois fluxos de logs independentes:

- **Logs de serviços** (`/logs`): streaming em tempo real via SSE, filtrado por Log Group e Log Stream, gerenciado pelo `useLogStream` hook e `LogViewer` component. O método `getLogGroups(): Promise<string[]>` alimenta os seletores neste fluxo. Essa infraestrutura está **concluída e não será tocada**.

- **CloudWatch Log Groups** (nova feature): visão administrativa de grupos de logs com metadados (retenção, tamanho), criação e deleção. Requer um tipo de dados mais rico (`LogGroupMetadata`) e novos endpoints REST dedicados.

A estratégia central desta mudança é **adição sem modificação**: novos métodos no `RuntimeProvider`, novos endpoints em namespace `/api/cloudwatch/`, novo componente e nova página — tudo sem alterar o código existente.

## Goals / Non-Goals

**Goals:**

- Adicionar `LogGroupMetadata` como novo tipo em `@ministack-ui/shared`.
- Adicionar `getLogGroupsWithMetadata()`, `createLogGroup()` e `deleteLogGroup()` ao `RuntimeProvider`, sem alterar `getLogGroups()`.
- Criar endpoints REST `/api/cloudwatch/log-groups` (`GET`, `POST`, `DELETE`).
- Implementar a página `/cloudwatch/logs` com tabela, modal de criação e ações por linha.
- Exportar `LogGroupsTable` como componente reutilizável com Storybook story.

**Non-Goals:**

- Alterar `getLogGroups(): Promise<string[]>`, `LogViewer`, `useLogStore`, `/logs/page.tsx` ou qualquer código existente.
- Persistência de dados entre reinicializações (mock em memória é suficiente para dev local).

## Decisions

### 1. Novo tipo `LogGroupMetadata` em `@ministack-ui/shared`

**Decisão:** Adicionar ao arquivo `packages/shared/src/types.ts`:

```typescript
export interface LogGroupMetadata {
  name: string;
  retentionDays: number | null; // null = Never Expire
  storedBytes: number; // sempre em bytes; formatação é responsabilidade do componente
  createdAt: string; // ISO 8601
}
```

**Justificativa:** Centralizar no shared evita duplicação entre o runtime-sdk e a camada de UI. `storedBytes` em bytes garante consistência — o componente formata para KB/MB conforme necessário.

### 2. Retrocompatibilidade: `getLogGroupsWithMetadata()` vs alterar `getLogGroups()`

**Decisão:** Adicionar um novo método opcional à interface:

```typescript
export interface RuntimeProvider {
  // métodos existentes (inalterados):
  getLogGroups(): Promise<string[]>;
  getLogStreams(logGroup: string): Promise<string[]>;
  streamLogs(...): Promise<() => void>;
  // ...

  // novos métodos:
  getLogGroupsWithMetadata(): Promise<LogGroupMetadata[]>;
  createLogGroup(name: string, retentionDays?: number | null): Promise<LogGroupMetadata>;
  deleteLogGroup(name: string): Promise<void>;
}
```

**Justificativa:** Alterar `getLogGroups()` para retornar `LogGroupMetadata[]` quebraria o `LogViewer`, o `useLogStore` e a página `/logs` — três consumidores que dependem de `string[]`. Um novo método evita qualquer regressão, sem acoplamento.

**Trade-off:** Dois métodos parecidos no provider. Aceitável: `getLogGroups()` serve a seletores reativos (streaming context); `getLogGroupsWithMetadata()` serve à visão administrativa (one-shot fetch).

### 3. Namespace `/api/cloudwatch/` para os novos endpoints

**Decisão:** Criar os Route Handlers em:

| Método   | Rota                         | Descrição                                                                                  |
| -------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| `GET`    | `/api/cloudwatch/log-groups` | Lista `LogGroupMetadata[]`                                                                 |
| `POST`   | `/api/cloudwatch/log-groups` | Cria Log Group. Body: `{ name: string, retentionDays?: number \| null, provider: string }` |
| `DELETE` | `/api/cloudwatch/log-groups` | Deleta Log Group. Query: `?name=<group>&provider=<provider>`                               |

**Justificativa:** Usar `/api/cloudwatch/` em vez de estender `/api/logs/` isola os endpoints administrativos dos de streaming. Previne conflitos futuros se outras features CloudWatch (Metrics, Alarms) forem adicionadas.

### 4. Estado mock em memória com singleton de módulo

**Decisão:** Usar uma variável de módulo (fora da classe) como estado compartilhado no processo Node.js:

```typescript
// MiniStackProvider.ts
let mockLogGroupsStore: LogGroupMetadata[] = [
  {
    name: '/demo-app/api',
    retentionDays: null,
    storedBytes: 7163136,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    name: '/ecs/demo-api',
    retentionDays: null,
    storedBytes: 1829918,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    name: '/ecs/demo-worker',
    retentionDays: null,
    storedBytes: 1159495,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    name: '/infra/ministack',
    retentionDays: null,
    storedBytes: 0,
    createdAt: '2026-03-01T00:00:00Z',
  },
];
```

**Justificativa:** Múltiplas requests ao mesmo endpoint enxergam o mesmo estado (criações/deleções refletem imediatamente na tabela), sem exigir banco de dados. Os dados acima espelham exatamente o mockup de UI solicitado pelo usuário.

### 5. Componente `LogGroupsTable` e Página `/cloudwatch/logs`

**Decisão:** Separar apresentação de dados em dois layers:

- **`LogGroupsTable`** (`packages/ui`) — componente controlado, recebe `groups: LogGroupMetadata[]`, `onDelete`, `onViewLogs`, `isLoading`. Zero lógica de fetch.
- **`/cloudwatch/logs/page.tsx`** (`apps/web`) — gerencia estado local com `useState`/`useEffect`/`fetch`. Não usa Zustand (dados não precisam ser globais).

**UX da tabela:**

- **Name**: badge monospace com o path do grupo (ex: `/ecs/demo-api`).
- **Retention**: "Never Expire" quando `null`, senão `"N days"`.
- **Stored Size**: formatado em KB/MB com 2 casas decimais (ex: `6995.75 KB`).
- **Actions**: "View Logs" navega para `/logs?logGroup=<name>` ; "Delete" pede confirmação inline antes de chamar o endpoint.

**Modal "Create Log Group":** campos `Name` (required, texto livre) e `Retention (days)` (opcional, número; vazio = Never Expire). Submit chama `POST /api/cloudwatch/log-groups`, atualiza a lista localmente com o grupo retornado.

### 6. Integração com a página `/logs` existente (somente leitura)

**Decisão:** O botão "View Logs" na tabela navega para `/logs?logGroup=<name>`. A página `/logs` já lê query params para pré-selecionar o grupo via `useEffect` — se ainda não suportar isso, a tarefa de UI incluirá somente a leitura do query param `logGroup` na inicialização, sem qualquer outra mudança.

**Justificativa:** Reutiliza o fluxo de streaming já funcional com mínima alteração (apenas ler um query param na montagem do componente).

## Risks / Trade-offs

- **[Risco] Dois métodos similares no provider** → `getLogGroups()` e `getLogGroupsWithMetadata()` coexistem.  
  _Mitigação_: Documentar na interface que `getLogGroups()` é para seletores reativos e `getLogGroupsWithMetadata()` é para a visão administrativa. Em sprint futura, avaliar unificação.

- **[Risco] Estado mock não persistido** → Grupos criados se perdem ao reiniciar o servidor.  
  _Mitigação_: Comportamento esperado e documentado para ambiente de dev local. Persistência será tratada quando integração real com LocalStack/AWS for implementada.

- **[Risco] Query param `logGroup` na página `/logs`** → Se a página não lê query params atualmente, o botão "View Logs" chegará sem pré-seleção.  
  _Mitigação_: Incluir na tarefa de UI a leitura do `useSearchParams()` na montagem para pré-selecionar o grupo.
