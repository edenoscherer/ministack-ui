## ADDED Requirements

### Requirement: SSE Log Streaming Endpoint

O Route Handler do Next.js `/api/logs/stream` MUST iniciar e gerenciar uma conexão Server-Sent Events (SSE) resiliente para transmitir os logs brutos fornecidos pelo `packages/runtime-sdk`.

#### Scenario: Successful streaming connection

- **WHEN** a client performs a GET request to `/api/logs/stream`
- **THEN** the server SHALL respond with HTTP status 200, and headers `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive` and begin streaming log entries.

#### Scenario: Keep-alive heartbeat transmission

- **WHEN** the streaming connection has been idle without new logs for 15 seconds
- **THEN** the server SHALL send a keep-alive message `:keep-alive` to prevent proxies or local gateways from dropping the connection.

#### Scenario: Clean client disconnect

- **WHEN** the client cancels the SSE connection or closes the browser window
- **THEN** the server SHALL immediately terminate the log subscription inside the `packages/runtime-sdk` and free memory and sockets.

### Requirement: Frontend Realtime Connection Hook

O frontend MUST implementar um hook `useLogStream` e uma store global Zustand para gerenciar o estado da conexão SSE de logs em tempo real de forma eficiente.

#### Scenario: Opening log streaming connection

- **WHEN** the logs page or component mounts
- **THEN** the hook SHALL initialize a native `EventSource` connection, transition state to `CONNECTING` and then `CONNECTED` upon a successful handshake.

#### Scenario: Automatic reconnection with backoff

- **WHEN** the SSE connection drops unexpectedly
- **THEN** the client hook SHALL automatically transition to `CONNECTING` and retry connection using an exponential backoff strategy up to a maximum of 5 attempts.

#### Scenario: Circular buffer size limit

- **WHEN** a new log message is received by the store and the buffer contains exactly 1000 logs
- **THEN** the store SHALL append the new log at the end and drop the oldest log entry in a FIFO manner to prevent browser memory leaks.

### Requirement: Log Parsing and Formatting Engine

O pacote `packages/log-engine` MUST expor utilitários de parsing que recebam mensagens brutas de logs de runtime e as transformem em um modelo de dados padronizado e estruturado.

#### Scenario: Parsing structured JSON logs

- **WHEN** a raw log containing a valid JSON payload is passed to the engine parser
- **THEN** the engine SHALL extract metadata such as `timestamp`, `level` (INFO, WARN, ERROR, DEBUG), `service`, `message` and bind the remaining payload as an object.

#### Scenario: Parsing flat raw text logs

- **WHEN** a raw text log string (non-JSON) is passed to the engine parser
- **THEN** the engine SHALL attempt to match and parse the timestamp, severity level, and emitter service using pre-compiled regex patterns, defaulting missing fields gracefully.

### Requirement: LogViewer UI Component

O componente `LogViewer` no pacote `packages/ui` MUST prover uma visualização clara dos logs, com filtros em memória de alta performance e controles do fluxo de streaming.

#### Scenario: Interactive filtering by levels and services

- **WHEN** the user selects the filters for "ERROR" level and "auth-service"
- **THEN** the `LogViewer` SHALL filter and display only the logs matching both conditions instantaneously without modifying the underlying background logs array.

#### Scenario: Pausing and resuming visual rendering

- **WHEN** the user clicks the "Pause" control button
- **THEN** the `LogViewer` SHALL stop updating the visual list while the store continues to accumulate new logs in the background buffer. Upon clicking "Resume", it SHALL visually sync up.

#### Scenario: Auto-scroll behavior control

- **WHEN** new logs arrive and auto-scroll is enabled and the user is scrolled to the bottom
- **THEN** the component SHALL scroll down to reveal the newest log. If the user scrolls up manually, auto-scroll SHALL be disabled.

### Requirement: JsonTree UI Component

O pacote `packages/ui` MUST fornecer o componente `JsonTree` para inspecionar de forma aninhada, colorizada e interativa os payloads e metadados estruturados dos logs.

#### Scenario: Expanding deep JSON nodes

- **WHEN** a user clicks an expandable node representing an object or array in the JSON tree
- **THEN** the node SHALL expand smoothly and reveal nested keys with appropriate styling matching the system dark theme.
