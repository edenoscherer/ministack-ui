## Why

Desenvolvedores que utilizam MiniStack ou LocalStack para desenvolvimento local de microsserviços e aplicações serverless sofrem com a falta de uma ferramenta centralizada de diagnóstico. A visualização de logs pelo terminal é caótica e dificulta a correlação e a depuração ágil de erros. Esta mudança introduz a transmissão de logs em tempo real (via SSE), parsing automático de payloads estruturados, filtragem flexível e inspeção interativa de objetos JSON, fornecendo uma experiência premium e produtiva para depuração local sem a complexidade ou lentidão de consoles de nuvem tradicionais.

## What Changes

- **Endpoint de Transmissão SSE**: Criação de um Route Handler do Next.js `/api/logs/stream` que atua como proxy de streaming em tempo real a partir dos provedores de runtime do `packages/runtime-sdk`.
- **Mecanismo de Parsing de Logs**: Desenvolvimento do parser de logs no `packages/log-engine` para decodificar saídas textuais brutas em objetos estruturados com atributos como timestamp, nível (INFO/WARN/ERROR), serviço emissor e dados estruturados.
- **Filtros e Controles de UI**: Implementação de controles interativos na interface do usuário (pesquisa de texto, seleção de níveis de severidade, seleção de serviços) e controles de fluxo de streaming (Pausar/Retomar, Limpar, Auto-scroll).
- **Visualizador de JSON Interativo**: Criação do componente `JsonTree` no `packages/ui` para permitir a expansão e exploração de payloads JSON aninhados presentes nos logs.
- **Stories do Storybook**: Criação de cenários interativos no Storybook com mocks dinâmicos para simular fluxos contínuos de logs, estados de conexão falha/reconexão e erros de parsing.

## Capabilities

### New Capabilities

- `logs-realtime`: Transmissão de logs em tempo real via Server-Sent Events (SSE) do backend para o frontend, incluindo parsing de logs, filtragem dinâmica e visualização interativa de estruturas JSON.

### Modified Capabilities

<!-- Nenhuma modificação em especificações de regras funcionais anteriores -->

## Impact

- **apps/web**: Adição do Route Handler `/api/logs/stream`, integração dos hooks customizados `useLogStream` para gerenciar a conexão SSE, resiliência e auto-reconnect, e renderização da tela de logs.
- **packages/ui**: Desenvolvimento/refinamento dos componentes `LogViewer` e `JsonTree`, com suporte a filtros locais, auto-scroll inteligente e pausa de fluxo de streaming.
- **packages/log-engine**: Implementação de utilitários de parsing para converter diferentes formatos de logs (incluindo JSON bruto e logs de texto tradicionais da AWS) em um modelo padrão tipado.
- **packages/runtime-sdk**: Exportação de métodos do provider que leem logs de forma contínua do runtime subjacente (MiniStack/LocalStack).
- **apps/storybook**: Stories criadas e atualizadas para documentar e validar isoladamente a interface de visualização de logs sob condições realistas.

## Non-goals (Fora do Escopo)

- **Persistência de Longo Prazo**: Não haverá banco de dados ou arquivos de histórico persistente de logs no servidor (os logs permanecem em memória ou são apenas transmitidos em streaming pelo endpoint SSE).
- **Sincronização de Estado de Filtros**: Não haverá persistência de filtros na URL ou localStorage nesta sprint (pode ser considerado no futuro).
- **Correlation Distribuída Avançada**: A correlação avançada de traces e timeline de eventos (correlation IDs ligando múltiplos microsserviços) faz parte da Sprint 3/4 e não será detalhada aqui.
- **Lógica de Conexão AWS Direta no Cliente**: O frontend em nenhuma hipótese fará requisições diretas a recursos da AWS ou SDKs da AWS, respeitando o princípio de isolamento.
