## ADDED Requirements

### Requirement: List Log Groups

A API do Next.js `/api/logs/groups` MUST fornecer a listagem completa dos Log Groups do CloudWatch disponíveis no runtime ativo.

#### Scenario: Retrieve groups list successfully

- **WHEN** a client makes a GET request to `/api/logs/groups?provider=ministack`
- **THEN** the server SHALL return a JSON response with status 200 and the list of active Log Groups under the `groups` key in data.

### Requirement: List Log Streams

A API do Next.js `/api/logs/streams` MUST fornecer a listagem de todas as Log Streams pertencentes a um Log Group específico.

#### Scenario: Retrieve streams list successfully

- **WHEN** a client makes a GET request to `/api/logs/streams?provider=ministack&logGroup=/aws/lambda/auth-function`
- **THEN** the server SHALL return a JSON response with status 200 and the list of active Log Streams under the `streams` key in data.
