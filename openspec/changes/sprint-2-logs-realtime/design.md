## Context

A arquitetura do MiniStack UI é baseada em Next.js 15 rodando em um monorepo Turborepo. A Sprint 2 introduz o primeiro recurso dinâmico e em tempo real: o **Logs Realtime**. Atualmente, não há mecanismo para capturar os logs dos runtimes (MiniStack, LocalStack) e transmiti-los ao frontend. A proposta especifica que o tráfego de logs seja bidirecional do backend para o frontend via Server-Sent Events (SSE).

Este documento descreve as decisões de arquitetura para implementar os fluxos do backend, o proxy de eventos SSE, o mecanismo de parsing do `packages/log-engine` e os componentes UI atualizados no `packages/ui` e `apps/web`.

## Goals / Non-Goals

**Goals:**

- Implementar uma conexão unidirecional contínua de baixa latência e baixo overhead de CPU via Server-Sent Events (SSE) nativo de Next.js 15.
- Construir um mecanismo de parsing no `packages/log-engine` capaz de extrair metadados úteis de logs brutos textuais ou JSONs stringificados.
- Adicionar componentes de visualização otimizados, incluindo `JsonTree` de alta performance e um `LogViewer` reativo com controles de Pause/Play, Auto-scroll e busca dinâmica.
- Desenvolver Stories de alta fidelidade para Storybook para testar esses componentes isoladamente com mocks de alta taxa de dados.

**Non-Goals:**

- Persistência e indexação de histórico de logs (banco de dados). Toda filtragem e retenção ocorrem em memória do cliente.
- Correlação de traces cruzados (Correlation IDs ligando filas/tópicos). Isso será feito em sprints futuras.
- Interface direta da AWS CloudWatch no frontend (violando as regras de arquitetura).

## Decisions

### 1. Mecanismo de Streaming nos Providers do `packages/runtime-sdk`

- **Opção Escolhida**: Padrão de Assinatura via Callback com Unsubscribe (`streamLogs`).
  ```typescript
  interface RuntimeProvider {
    streamLogs(onLog: (log: RawLog) => void): Promise<() => void>;
  }
  ```
- **Justificativa**: Extremamente simples, fácil de implementar em qualquer provider (seja lendo de sockets docker, streams da AWS ou arquivos locais) e não impõe dependências externas como RxJS que podem complicar o empacotamento dos pacotes locais.
- **Alternativas Consideradas**:
  - _Async Generators (`AsyncGenerator`)_: Elegante, porém o cancelamento prematuro e a integração com Streams do Node no Next.js Route Handlers geram mais boilerplate e edge-cases de vazamento de memória.

### 2. Protocolo de Transmissão Realtime (Backend -> Frontend)

- **Opção Escolhida**: Server-Sent Events (SSE) rodando sobre HTTP regular.
- **Justificativa**: Como a transmissão de logs é puramente unidirecional (servidor enviando para o cliente), o SSE é ideal. Ele opera sobre o protocolo HTTP normal, suporta reconexão automática de forma nativa pela API `EventSource` no navegador, e é fácil de implementar usando a resposta baseada em `ReadableStream` do Next.js 15.
- **Alternativas Consideradas**:
  - _WebSockets_: Causa overhead de infraestrutura, exige servidores adicionais e gestão de estado do socket duplex, que não é necessário para o fluxo unidirecional de visualização de logs.

### 3. Gerenciamento e Estruturação de Payloads (Parser)

- **Opção Escolhida**: Parser no `packages/log-engine` que retorna uma interface padronizada.
  ```typescript
  interface LogMessage {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    service: string;
    message: string;
    payload?: Record<string, any>;
  }
  ```
  O parser irá tentar:
  1. Identificar se a linha bruta é um JSON completo. Se for, extrai campos comuns e anexa o restante como `payload`.
  2. Aplicar expressões regulares comuns se for string plana (ex: logs no formato `[INFO] service-name: message`).
  3. Adotar fallback preenchendo a mensagem e marcando o nível como `info` e timestamp atual caso nenhum padrão case.
- **Justificativa**: Desacopla a interface visual dos formatos brutos e proprietários que variam entre MiniStack, LocalStack e AWS CloudWatch.
- **Alternativas Consideradas**:
  - _Repassar String Bruta_: Obriga o frontend a conter lógica de parsing acoplada, o que viola o princípio de separação de conceitos do projeto.

### 4. Performance do Navegador e Estouro de Memória (Memory Leak)

- **Opção Escolhida**: Buffer circular FIFO limitado no estado Zustand.
- **Justificativa**: Renderizar milhares de nós DOM pode travar o navegador rapidamente. O hook e a store de logs manterão no máximo 1000 logs em memória (Buffer circular FIFO). Se a lista ultrapassar o limite, os logs mais antigos são descartados do array. A renderização do `LogViewer` será simples e eficiente, e caso necessário, implementará virtualização.
- **Alternativas Consideradas**:
  - _Renderização Ilimitada_: Induziria regressão de performance e travamentos severos em microsserviços de alto throughput.

### 5. Componente de JSON Interativo (`JsonTree`)

- **Opção Escolhida**: Construção de um componente customizado e otimizado `JsonTree` utilizando shadcn/ui e Tailwind, evitando bibliotecas prontas que incham o bundle ou não suportam customização estrita de design. Ele suportará expansão recursiva profunda controlada.
- **Justificativa**: Garante consistência perfeita com a estética visual premium dark-mode/glassmorphism do projeto.

## Risks / Trade-offs

- **[Risk] Vazamento de Conexão (Sockets Abertos no Backend)** → `[Mitigation]` Garantir que o `ReadableStream` do Next.js limpe a assinatura (`unsubscribe`) no runtime-sdk assim que o cliente fechar a conexão HTTP (evento `cancel` do stream ou `close` do socket).
- **[Risk] Quedas de Conexão Silenciosas em Redes Locais** → `[Mitigation]` Adicionar um mecanismo de heartbeat a cada 15 segundos emitindo um comentário SSE (`:keep-alive`) para prevenir timeouts de proxies reversos e firewalls locais, além de tratar eventos de erro com reconexão progressiva exponencial no hook `useLogStream`.
- **[Risk] Processamento Excessivo de Parsing** → `[Mitigation]` O parsing de logs complexos será otimizado com Regex compiladas e lazily parsed payloads se forem expandidos na árvore JSON (apenas parsear o JSON interno quando o usuário interagir/expandir, se aplicável).

## Migration Plan

Nenhum plano de migração ou breaking change de infraestrutura é necessário, pois esta é a introdução de novos recursos de API e UI e não afeta nenhuma funcionalidade de persistência existente.

## Open Questions

- _Frequência de atualização_: Devemos fazer throttling de re-renderização no frontend (ex: lotes a cada 100ms) se a taxa de logs for extremamente agressiva?
  _Resposta prévia_: Implementaremos um buffer de acumulação rápida com batches na store Zustand para evitar renderização síncrona a cada entrada individual de log.
