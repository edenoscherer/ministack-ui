## Why

Atualmente, o visualizador de logs do MiniStack UI exibe logs genéricos por serviço sem uma correspondência direta ao modelo real da AWS. Para oferecer uma experiência premium de observabilidade local e alta fidelidade com a AWS, precisamos modelar os logs no formato do **Amazon CloudWatch Logs**, estruturados em **Log Groups** (Grupos de Logs) e **Log Streams** (Fluxos de Logs). Isso resolve a limitação atual onde logs de diferentes instâncias, lambdas ou containers de um mesmo serviço ficam misturados sem capacidade de isolamento ou correlação exata de stream.

## What Changes

- **Novos campos na tipagem de logs**: Extensão do modelo `LogMessage` no pacote `@ministack-ui/shared` para incluir opcionalmente `logGroup` e `logStream`.
- **Novos endpoints de API**:
  - `/api/logs/groups` para listar todos os grupos de logs ativos.
  - `/api/logs/streams` para listar as streams de um determinado grupo de logs.
  - Ajuste em `/api/logs/stream` para aceitar parâmetros de consulta `logGroup` e `logStream` para filtragem reativa no streaming SSE.
- **Engine de logs aprimorada**: Atualização no `packages/log-engine` para processar e estruturar dados com suporte a grupos e streams do CloudWatch.
- **Interface do LogViewer renovada**:
  - Adicionados seletores interativos e conectados de **Log Group** e **Log Stream** no cabeçalho de controles do `LogViewer`.
  - Atualização dos mocks do `MiniStackProvider` e `LocalStackProvider` no `packages/runtime-sdk` para simular cenários de logs reais de serviços AWS (Lambda, ECS, API Gateway, etc.) organizados por grupos e streams.
  - Aprimoramento da performance de filtragem em tempo real e visualização de payloads complexos.

## Capabilities

### New Capabilities

- `logs-groups-stream`: Introduz a infraestrutura de modelagem de CloudWatch Logs com suporte a múltiplos Log Groups e Log Streams e capacidade de filtragem seletiva tanto no backend quanto no frontend.

### Modified Capabilities

- `logs-realtime`: Modificação da capacidade de streaming em tempo real via SSE para suportar filtros por Log Group e Log Stream a nível de stream nativa.

## Impact

- `@ministack-ui/shared`: Atualização do tipo `LogMessage` para conter `logGroup?: string` e `logStream?: string`.
- `@ministack-ui/runtime-sdk`: Modificação da interface `RuntimeProvider` e dos provedores (`MiniStackProvider`, `LocalStackProvider`, `AwsProvider`) para suportar a listagem de grupos, streams e assinatura filtrada de logs.
- `@ministack-ui/log-engine`: Ajuste nas funções de parsing para injetar e correlacionar dados do CloudWatch.
- `apps/web`:
  - Novas rotas de API `/api/logs/groups` e `/api/logs/streams`.
  - Adaptação do `useLogStream` hook e `useLogStore` Zustand para manter os estados de seleção de logGroup e logStream atuais, limpando buffers ao alterar seleções.
  - Atualização da página `/logs` para renderizar os novos seletores e coordenar as buscas.
- `@ministack-ui/ui`: Redesenho do componente `LogViewer` para acomodar os novos seletores com visual elegante e responsivo.

## Non-Goals (Fora do Escopo)

- Persistência em banco de dados histórico para busca infinita de logs antigos (nesta sprint focamos em buffer em memória e streaming em tempo real).
- Criação e deleção manual de Log Groups/Streams através da UI (ação puramente administrativa).
- Exportação direta de logs em CSV ou formatos externos nesta fase.
