# Quickstart: Monorepo Foundation

Como validar a feature em um checkout limpo. Mapeia diretamente aos Acceptance Scenarios e
Success Criteria da spec.

## Pré-requisitos

- Node.js 24 LTS (via asdf: `asdf install`, lê `.tool-versions`).
- pnpm via corepack: `corepack enable` (versão fixada em `package.json` → `packageManager`).

## 1. Bootstrap (US1, SC-001)

```bash
git clone <repo> && cd ministack-ui
pnpm install            # instala todos os workspaces + Husky (FR-004, FR-006)
```

Esperado: instalação sem erros; `.husky/pre-commit` e `.husky/commit-msg` presentes. Alvo < 5 min (SC-001).

## 2. Pipeline (US1, SC-002, SC-005)

```bash
pnpm turbo run build lint typecheck test    # 4 comandos, todos exit 0
pnpm run audit                              # auditoria de dependências (FR-011)
pnpm run ci                                 # pipeline agregado (audit+build+lint+typecheck+test)
```

Esperado: todos verdes (SC-002). Reexecutar `pnpm run ci` sem mudanças ⇒ cache HIT, < 30 s (SC-005).

## 3. Config compartilhada (US2, SC-004)

```bash
# strict herdado: introduzir um erro de tipo em packages/shared/src/index.ts
pnpm turbo run typecheck    # deve FALHAR apontando o erro (reverter depois)

# lint compartilhado: introduzir violação de estilo
pnpm turbo run lint         # deve FALHAR apontando arquivo/linha (reverter depois)
```

Esperado: falhas apontam o local exato sem config extra além de estender a base.

## 4. Git hooks (US3, SC-003)

```bash
# mensagem fora do padrão é rejeitada
git commit -m "fix stuff"          # REJEITADO por commitlint (FR-008, SC-003)

# mensagem válida passa
git commit -m "feat: add shared types package"   # aceito (se lint-staged passar)
```

Esperado: Conventional Commits aplicado localmente; lint-staged autofixa/bloqueia staged (FR-007).

## 5. Auditoria bloqueante (SC-006)

```bash
# com uma dependência de vuln high/critical conhecida (sem exceção documentada):
pnpm run audit             # exit ≠ 0 — pipeline bloqueado (FR-011, SC-006)
```

Exceção rastreável (vuln sem fix upstream): adicionar a `pnpm.auditConfig.ignoreCves` no
`package.json` raiz com comentário de justificativa (edge case da spec).

## 6. Extensibilidade (US1 #3, FR-010)

```bash
# criar packages/exemplo com package.json + scripts padrão sob os globs do workspace
pnpm turbo run lint         # o novo pacote é descoberto automaticamente, sem editar a raiz
```
