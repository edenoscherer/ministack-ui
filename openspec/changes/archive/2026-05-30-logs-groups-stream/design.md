## Context

Atualmente, o monorepo `ministack-ui` possui suporte a streaming em tempo real genérico de logs. Para se adequar aos padrões reais de observabilidade e fidelidade de desenvolvimento AWS, o ecossistema deve simular com precisão o comportamento do **Amazon CloudWatch Logs**, onde os logs são classificados e isolados por **Log Groups** (ex: `/aws/lambda/auth-function`, `/aws/ecs/payment-service`) e **Log Streams** (ex: `2026/05/30/[$LATEST]1234abc`, `container-instance-xyz`).

Esta mudança visa reestruturar a assinatura, streaming e visualização dos logs, adicionando o agrupamento por essas duas dimensões no backend, APIs de suporte no Next.js Route Handlers e novos seletores dinâmicos e elegantes no frontend (`LogViewer`).

## Goals / Non-Goals

**Goals:**

- Estender `LogMessage` para incluir dados do CloudWatch (`logGroup` e `logStream`).
- Ajustar a assinatura `streamLogs` no `RuntimeProvider` para aceitar filtros dinâmicos de grupo e stream a nível de fonte emissora.
- Adicionar endpoints `/api/logs/groups` e `/api/logs/streams` para alimentar os seletores de UI.
- Redesenhar a interface do `LogViewer` adicionando seletores interativos conectados de Log Group e Log Stream com excelente estética escura.
- Atualizar `MiniStackProvider` e `LocalStackProvider` para simular múltiplos grupos de logs correspondentes aos recursos locais em execução.

**Non-Goals:**

- Suporte a persistência permanente de logs em disco local nesta fase.
- Integração de buscas textuais baseadas em CloudWatch Insights Syntax (será tratada em sprint posterior).

## Decisions

### 1. Extensão da Interface `RuntimeProvider` e Assinatura Filtrada

**Decisão:** Atualizar a assinatura de `streamLogs` e expor novos métodos para listar os metadados do CloudWatch:

```typescript
export interface RuntimeProvider {
  logs(): Promise<void>;
  queues(): Promise<void>;
  topics(): Promise<void>;
  secrets(): Promise<void>;
  streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void>;
  getLogGroups(): Promise<string[]>;
  getLogStreams(logGroup: string): Promise<string[]>;
}
```

**Justificativa:** Filtrar logs no backend é crucial para evitar tráfego de rede desnecessário e sobrecarga na memória do cliente (Zustand store), mantendo o desempenho excelente mesmo sob alto volume de logs.

### 2. Endpoints Route Handlers do Next.js

**Decisão:** Criar arquivos de rota adicionais:

- `/api/logs/groups/route.ts`: Retorna `{ groups: string[] }` baseado no provedor selecionado.
- `/api/logs/streams/route.ts`: Retorna `{ streams: string[] }` dado um `logGroup` fornecido como searchParam.
- Atualizar `/api/logs/stream/route.ts` para ler `logGroup` e `logStream` da URL e repassar ao `streamLogs` do provedor.

**Justificativa:** Centralizar a comunicação do SDK no backend garante conformidade com a regra de qualidade "Frontend NUNCA acessa AWS diretamente".

### 3. Seletores na UI com Estado Centralizado no Zustand

**Decisão:** Adicionar seletores conectados no `LogViewer`. Ao selecionar um Log Group, o seletor de Log Streams carrega as streams daquele grupo. O estado de seleção atual será passado do Route Handler via SSE. Quando a seleção muda, a conexão SSE é recriada com os novos parâmetros e o buffer do Zustand é limpo para evitar contaminação visual.

**Justificativa:** Proporciona uma transição suave de logs e garante que a UI mostre apenas logs consistentes com o filtro selecionado.

## Risks / Trade-offs

- **[Risco] Reconexões Excessivas ao Alterar Filtros** → Ao trocar de grupo ou stream, a conexão do hook `useLogStream` será desfeita e restabelecida com novos parâmetros de consulta. Isso causa breves reconexões.
  _Mitigação_: Implementar transição suave de estados de carregamento (exibindo um pequeno spinner no cabeçalho do `LogViewer` e mantendo a transição rápida).
- **[Risco] Formato de Logs Legados (Não-JSON)** → Logs brutos estruturados gerados por ferramentas legadas podem não ter metadados de grupo/stream embutidos.
  _Mitigação_: A engine de logs detectará esses logs e associará a um Log Group padrão global `/aws/ministack/default` e Log Stream `/default-stream`.
