# Contract: Pipeline Tasks

Contrato das tarefas do Turborepo executáveis a partir da raiz. Um pacote adere ao pipeline
apenas expondo os scripts correspondentes; a ausência de um script significa não-participação
(não falha).

## Comandos raiz (contrato público de CLI)

| Comando | Descrição | Sucesso | Requisito |
|---------|-----------|---------|-----------|
| `pnpm install` | Instala todos os workspaces + instala Husky (`prepare`) | exit 0; hooks presentes em `.husky/` | FR-004, FR-006 |
| `pnpm turbo run build` | Builda todos os pacotes com script `build` | exit 0 (0 pacotes ⇒ ainda exit 0) | FR-005 |
| `pnpm turbo run lint` | Lint de todos os pacotes | exit 0 sem erros de lint | FR-005, FR-002 |
| `pnpm turbo run typecheck` | Type-check strict de todos os pacotes | exit 0 sem erros de tipo | FR-005, FR-009 |
| `pnpm turbo run test` | Roda testes de todos os pacotes | exit 0 (verde) | FR-005 |
| `pnpm run audit` | Auditoria de dependências | exit 0 se nenhuma vuln high/critical; exit ≠ 0 caso contrário | FR-011, SC-006 |
| `pnpm run ci` | Pipeline agregado: `audit` + `build` + `lint` + `typecheck` + `test` | exit 0 só se todos passarem | SC-002, SC-005 |

## Contrato por tarefa (`turbo.json`)

```jsonc
{
  "tasks": {
    "build":     { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "lint":      { "dependsOn": [] },
    "typecheck": { "dependsOn": ["^build"] },
    "test":      { "dependsOn": ["^build"] },
    "audit":     { "cache": false }
  }
}
```

## Garantias

- **Determinismo/cache** (SC-005): reexecução sem mudanças ⇒ cache HIT, < 30 s. Primeira
  execução em checkout limpo ⇒ < 3 min.
- **Vazio ≠ falha**: com 0 pacotes expondo uma tarefa, o comando ainda retorna exit 0.
- **Auditoria bloqueante** (FR-011/SC-006): `audit` retorna exit ≠ 0 em severidade high/critical,
  sem exceção documentada. Exceções vão em `pnpm.auditConfig.ignoreCves` com justificativa.
- **Descoberta automática** (FR-010): novo pacote sob os globs entra no pipeline sem editar a raiz.

## Critérios de verificação

1. Em checkout limpo: `pnpm install && pnpm run ci` ⇒ exit 0 (Acceptance US1 #1, #2).
2. Segunda execução de `pnpm run ci` sem mudanças ⇒ concluída em < 30 s (SC-005).
3. Introduzir dep com CVE high conhecido ⇒ `pnpm run audit` ⇒ exit ≠ 0 (SC-006).
