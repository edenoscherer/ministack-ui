# dashboard-service-filtering Specification

## Purpose

TBD - created by archiving change update-interface-lovable. Update Purpose after archive.

## Requirements

### Requirement: Filter AWS Services by Type

O dashboard SHALL permitir que o usuário filtre os serviços emulados por tipo através de botões de seleção de tipo (All Services, Serverless, Messaging, Storage, Config).

#### Scenario: User filters by Messaging services

- **WHEN** o usuário clica no filtro "Messaging"
- **THEN** a lista de serviços exibida SHALL conter apenas os serviços da categoria Messaging, como SQS e SNS

### Requirement: Filter AWS Services by Status

O dashboard SHALL permitir que o usuário filtre os serviços emulados pelo seu estado de saúde ou status operacional (Healthy, Warning, Offline) usando um campo seletor.

#### Scenario: User filters by Healthy status

- **WHEN** o usuário seleciona "Healthy" no filtro de status
- **THEN** a lista de serviços exibida SHALL conter apenas os serviços cujo status atual seja "healthy"

### Requirement: Search AWS Services by Name

O dashboard SHALL fornecer uma barra de pesquisa para filtrar dinamicamente os serviços locais pelo nome.

#### Scenario: User searches for service by partial name match

- **WHEN** o usuário insere o termo de busca "processor" no campo de pesquisa
- **THEN** a lista de serviços exibida SHALL conter apenas os serviços cujos nomes contenham a palavra "processor" de forma case-insensitive
