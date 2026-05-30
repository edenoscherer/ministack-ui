## MODIFIED Requirements

### Requirement: SSE Log Streaming Endpoint

O Route Handler do Next.js `/api/logs/stream` MUST iniciar e gerenciar uma conexão Server-Sent Events (SSE) resiliente para transmitir os logs brutos fornecidos pelo `packages/runtime-sdk`, suportando parâmetros opcionais de filtragem por Log Group e Log Stream.

#### Scenario: Successful streaming connection

- **WHEN** a client performs a GET request to `/api/logs/stream`
- **THEN** the server SHALL respond with HTTP status 200, and headers `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive` and begin streaming log entries.

#### Scenario: Successful streaming connection with filtering parameters

- **WHEN** a client performs a GET request to `/api/logs/stream?logGroup=/aws/lambda/auth-function&logStream=2026/05/30/[$LATEST]1234abc`
- **THEN** the server SHALL respond with HTTP status 200 and stream ONLY log entries matching the selected Log Group and Log Stream.

#### Scenario: Keep-alive heartbeat transmission

- **WHEN** the streaming connection has been idle without new logs for 15 seconds
- **THEN** the server SHALL send a keep-alive message `:keep-alive` to prevent proxies or local gateways from dropping the connection.

#### Scenario: Clean client disconnect

- **WHEN** the client cancels the SSE connection or closes the browser window
- **THEN** the server SHALL immediately terminate the log subscription inside the `packages/runtime-sdk` and free memory and sockets.

### Requirement: LogViewer UI Component

O componente `LogViewer` no pacote `packages/ui` MUST prover uma visualização clara dos logs, com filtros em memória de alta performance, controles de fluxo de streaming e seletores interativos conectados para Log Group e Log Stream do CloudWatch.

#### Scenario: Interactive filtering by levels and services

- **WHEN** the user selects the filters for "ERROR" level and "auth-service"
- **THEN** the `LogViewer` SHALL filter and display only the logs matching both conditions instantaneously without modifying the underlying background logs array.

#### Scenario: Interactive filtering by log group and log stream

- **WHEN** the user selects a Log Group `/aws/lambda/auth-function` and a Log Stream `2026/05/30/[$LATEST]1234abc`
- **THEN** the `LogViewer` SHALL update the streaming connection with these filters, reset the local logs buffer, and display only incoming logs belonging to the selected group and stream.

#### Scenario: Pausing and resuming visual rendering

- **WHEN** the user clicks the "Pause" control button
- **THEN** the `LogViewer` SHALL stop updating the visual list while the store continues to accumulate new logs in the background buffer. Upon clicking "Resume", it SHALL visually sync up.

#### Scenario: Auto-scroll behavior control

- **WHEN** new logs arrive and auto-scroll is enabled and the user is scrolled to the bottom
- **THEN** the component SHALL scroll down to reveal the newest log. If the user scrolls up manually, auto-scroll SHALL be disabled.
