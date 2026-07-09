# Feature Specification: Monorepo Foundation

**Feature Branch**: `001-monorepo-foundation`
**Created**: 2026-07-09
**Status**: Draft
**Input**: User description: "Configura o monorepo Turborepo + pnpm workspaces com todas as ferramentas de qualidade: turbo.json + pnpm-workspace.yaml + package.json raiz, packages/eslint-config (regras TypeScript strict compartilhadas), packages/shared (tipos base compartilhados), Husky + Conventional Commits + lint-staged, pipeline turbo run build | lint | typecheck | test." (docs/roadmap.md, spec 001; docs/PROGRESS.md)

## Clarifications

### Session 2026-07-09

- Q: Qual meta de performance o pipeline (build/lint/typecheck/test) deve atingir? → A: Ambos: cache frio <3min e cache quente <30s
- Q: Deve haver um passo de auditoria de dependências (segurança de supply chain) no pipeline desta spec? → A: `pnpm audit` (ou equivalente) roda no pipeline e bloqueia build/CI em vulnerabilidades críticas/altas

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ambiente local funcional em um comando (Priority: P1)

Como colaborador entrando no projeto, eu clono o repositório, rodo um único comando de
instalação e tenho um monorepo funcional — com lint, typecheck, build e test executáveis a
partir da raiz — sem precisar configurar nada manualmente em cada pacote.

**Why this priority**: Sem isso, nenhum outro sprint do roadmap (specs 002–014) pode começar.
É a base que viabiliza todo o resto do projeto.

**Independent Test**: Clonar o repositório em uma máquina limpa, rodar o comando de instalação
documentado e, em seguida, `turbo run build`, `turbo run lint`, `turbo run typecheck` e
`turbo run test` a partir da raiz — todos devem completar com sucesso.

**Acceptance Scenarios**:

1. **Given** um clone limpo do repositório, **When** o colaborador roda o comando de instalação
   documentado, **Then** todas as dependências de todos os workspaces são instaladas sem erros.
2. **Given** as dependências instaladas, **When** o colaborador roda `turbo run build`,
   `turbo run lint`, `turbo run typecheck` e `turbo run test` a partir da raiz, **Then** os
   quatro comandos completam com sucesso (exit code 0), mesmo sem nenhum app de produto ainda
   presente no monorepo.
3. **Given** o monorepo configurado, **When** um novo pacote é adicionado sob `packages/*` ou
   `apps/*` seguindo os padrões de workspace, **Then** ele é automaticamente reconhecido pelo
   Turborepo e incluído nos comandos de pipeline sem configuração adicional.

---

### User Story 2 - Regras de qualidade compartilhadas (Priority: P2)

Como colaborador escrevendo código em qualquer pacote do monorepo, eu preciso que as regras de
lint e TypeScript strict sejam consistentes em todos os pacotes, sem precisar duplicar
configuração a cada novo pacote criado.

**Why this priority**: Consistência de código é um requisito da Constituição do projeto
(Princípio VI) e evita divergência de estilo entre pacotes desde o primeiro dia.

**Independent Test**: Criar um pacote de teste que estenda `packages/eslint-config` e escrever
código que viole uma regra strict do TypeScript — o comando `turbo run lint`/`typecheck` deve
falhar apontando o erro, sem exigir configuração extra além de estender o pacote compartilhado.

**Acceptance Scenarios**:

1. **Given** um novo pacote que estende `packages/eslint-config`, **When** o código viola uma
   regra de lint compartilhada, **Then** `turbo run lint` falha apontando o erro exato.
2. **Given** um novo pacote com TypeScript strict habilitado via configuração compartilhada,
   **When** o código contém um erro de tipo (ex: uso implícito de `any`), **Then**
   `turbo run typecheck` falha apontando o erro.
3. **Given** `packages/shared`, **When** qualquer outro pacote do monorepo importa um tipo dele,
   **Then** a importação funciona sem necessidade de build prévio manual (resolução direta via
   workspace).

---

### User Story 3 - Qualidade garantida antes do commit (Priority: P3)

Como colaborador prestes a commitar uma mudança, eu quero que hooks automáticos rodem lint nos
arquivos alterados e validem o formato da mensagem de commit, para que erros óbvios não cheguem
sequer ao repositório remoto.

**Why this priority**: Reduz retrabalho em revisão de PR e mantém o histórico de commits
padronizado, mas o projeto ainda funciona (com revisão manual) mesmo sem essa camada — por isso
é P3 em relação às duas anteriores.

**Independent Test**: Tentar commitar um arquivo com erro de lint e uma mensagem que não segue
Conventional Commits — ambos devem ser rejeitados localmente, antes do commit ser criado.

**Acceptance Scenarios**:

1. **Given** um arquivo staged com uma violação de lint autofixável, **When** o colaborador roda
   `git commit`, **Then** o hook de pre-commit corrige automaticamente o que for autofixável e
   bloqueia o commit se restar erro não corrigível.
2. **Given** uma mensagem de commit que não segue Conventional Commits (ex: `"fix stuff"` sem
   tipo), **When** o colaborador tenta commitar, **Then** o commit é rejeitado com uma mensagem
   explicando o formato esperado.
3. **Given** uma mensagem de commit válida (ex: `"feat: add shared types package"`) e nenhum
   arquivo staged com erro de lint, **When** o colaborador roda `git commit`, **Then** o commit é
   criado normalmente.

---

### Edge Cases

- O que acontece quando `turbo run test` é executado sem nenhum arquivo de teste existente em
  nenhum pacote? Deve ser tratado como sucesso (no-op), não como falha.
- O que acontece se um pacote novo não for registrado nos padrões de glob de
  `pnpm-workspace.yaml`? Ele fica fora do escopo dos comandos de pipeline — comportamento
  esperado e documentado, não um bug.
- O que acontece se um colaborador tentar commitar sem nenhum arquivo staged? O hook de
  pre-commit não deve bloquear (lint-staged não tem nada para processar).
- O que acontece se um pacote precisar de uma regra de lint diferente da compartilhada? Ele deve
  poder estender e sobrescrever pontualmente a configuração base, nunca duplicá-la do zero.
- O que acontece quando a auditoria de dependências encontra uma vulnerabilidade crítica/alta
  sem correção disponível upstream? Deve ser documentada como exceção rastreável (allowlist
  temporária com justificativa), nunca ignorada silenciosamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE prover configuração raiz de monorepo (`package.json`,
  `pnpm-workspace.yaml`, `turbo.json`) que reconheça todos os pacotes sob `packages/*` e
  `apps/*` como workspaces.
- **FR-002**: O sistema DEVE prover um pacote `packages/eslint-config` com regras de ESLint e
  TypeScript strict compartilhadas, consumível por qualquer outro pacote/app via extensão de
  configuração.
- **FR-003**: O sistema DEVE prover um pacote `packages/shared` para tipos e utilitários base,
  sem efeitos colaterais, consumível por qualquer outro pacote/app do workspace.
- **FR-004**: O sistema DEVE permitir que um colaborador instale todas as dependências de todos
  os workspaces com um único comando, a partir de um clone limpo.
- **FR-005**: O sistema DEVE expor quatro comandos de pipeline executáveis a partir da raiz:
  `turbo run build`, `turbo run lint`, `turbo run typecheck`, `turbo run test` — cada um
  completando com sucesso mesmo quando nenhum app de produto ainda existe no monorepo.
- **FR-006**: O sistema DEVE instalar hooks de pre-commit (Husky) automaticamente durante a
  instalação de dependências, sem passo manual adicional do colaborador.
- **FR-007**: O hook de pre-commit DEVE rodar lint-staged sobre os arquivos staged e bloquear o
  commit se restar erro de lint não autofixável.
- **FR-008**: O sistema DEVE validar que toda mensagem de commit segue o formato Conventional
  Commits, rejeitando localmente commits que não sigam o padrão.
- **FR-009**: TypeScript strict mode DEVE estar habilitado por padrão para qualquer novo
  pacote/app adicionado ao workspace que estenda a configuração compartilhada.
- **FR-010**: Um novo pacote adicionado sob `packages/*` ou `apps/*` DEVE ser automaticamente
  reconhecido pelos comandos de pipeline do Turborepo, sem exigir edição manual de configuração
  raiz além do próprio `package.json` do novo pacote.
- **FR-011**: O sistema DEVE rodar auditoria de dependências (ex: `pnpm audit` ou equivalente)
  como parte do pipeline, bloqueando (exit code não-zero) quando vulnerabilidades de severidade
  crítica ou alta forem detectadas.

### Key Entities

- **Workspace Package**: unidade de código dentro do monorepo (`packages/*` ou `apps/*`),
  identificada por nome, caminho e dependências declaradas em seu `package.json`.
- **Pipeline Task**: tarefa executável via Turborepo (`build`, `lint`, `typecheck`, `test`),
  aplicável a um ou mais Workspace Packages, com cache local de resultado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um novo colaborador consegue clonar o repositório e ter um ambiente local
  funcional (instalação concluída, pipeline executável) em menos de 5 minutos.
- **SC-002**: 100% dos quatro comandos de pipeline (build, lint, typecheck, test) completam com
  sucesso em um checkout limpo.
- **SC-003**: 100% das tentativas de commit com mensagem fora do padrão Conventional Commits são
  bloqueadas localmente, antes de chegar ao repositório remoto.
- **SC-004**: 100% dos pacotes/apps adicionados ao workspace herdam a configuração
  compartilhada de ESLint/TypeScript strict sem setup adicional além de estender a configuração
  base.
- **SC-005**: Em cache frio (primeira execução, checkout limpo), os quatro comandos de pipeline
  (`build`, `lint`, `typecheck`, `test`) completam em menos de 3 minutos; em cache quente
  (execução subsequente sem mudanças), completam em menos de 30 segundos.
- **SC-006**: 100% das execuções de pipeline com dependências contendo vulnerabilidade
  crítica ou alta conhecida (sem exceção documentada) são bloqueadas antes de chegar a
  build/merge.

## Assumptions

- Este spec cobre apenas a fundação do monorepo (`packages/eslint-config`, `packages/shared`,
  configuração raiz). `apps/web` (spec 003) e `apps/storybook` (spec 004) são specs
  independentes, fora deste escopo.
- Versões exatas de Node.js e pnpm serão fixadas durante `/speckit.plan` (ex: via campo
  `engines` e/ou `.nvmrc`); esta spec assume as versões LTS vigentes no momento da implementação.
- Cache remoto do Turborepo (ex: Vercel Remote Cache) está fora de escopo — apenas cache local é
  necessário nesta fase.
- Integração com pipeline de CI (ex: GitHub Actions) está fora de escopo desta spec — o
  requisito aqui é que os comandos funcionem localmente; a automação em CI pode ser tratada em
  spec futura.
- Não há dependências de outras specs — esta é a spec fundacional (`Dependências: nenhuma` em
  `docs/roadmap.md`).
