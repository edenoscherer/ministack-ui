---
name: 'full-cycle'
description: 'Dispara o subagente full-cycle para orquestrar o ciclo completo de uma feature do MiniStack UI (Specify → Clarify → Checklist → Plan → Tasks → Analyze → Implement → Quality Gates → PR → Review) sem intervenção manual entre fases.'
argument-hint: "Descrição da feature ou número da spec (ex: 'log viewer com filtros' ou '006')"
compatibility: "Requires .claude/agents/full-cycle.md (subagent 'full-cycle') and spec-kit project structure with .specify/ directory"
metadata:
  author: 'ministack-ui'
  source: '.claude/agents/full-cycle.md'
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

## Comportamento

Este comando é um atalho fino para rodar o subagente **full-cycle** (definido em
`.claude/agents/full-cycle.md`), que atua como TechLead do MiniStack UI e conduz
sozinho todas as fases do Spec Kit — Specify, Clarify, Checklist, Plan, Tasks,
Analyze, Implement, Quality Gates e PR — encadeando-as sem pausar para confirmação
entre passos bem-sucedidos.

Este skill **não** reimplementa a lógica de orquestração: ele apenas dispara o
subagente e repassa o resultado. Toda a lógica de fases, Constitution Check,
commits intermediários e critérios de autocorreção vivem em
`.claude/agents/full-cycle.md` — não duplique essas regras aqui.

## Passos

1. Se `$ARGUMENTS` estiver vazio, pergunte ao usuário qual feature (descrição em
   linguagem natural ou número de spec já existente em `specs/`) deve ser
   desenvolvida antes de continuar. Não invente uma feature.

2. Verifique rapidamente o estado do repositório (`git status`, branch atual) para
   confirmar que não há trabalho não commitado que possa ser afetado — o
   subagente full-cycle fará commits ao longo do ciclo.

3. Invoque o subagente via Agent tool:
   - `subagent_type: "full-cycle"`
   - `description`: breve (3-5 palavras), ex. "Full cycle: <feature>"
   - `prompt`: repasse `$ARGUMENTS` tal como recebido, sem reescrever ou resumir
   - `run_in_background: false` — o usuário está aguardando o relatório final
     desta execução nesta mesma resposta. Se o ciclo for previsivelmente longo
     (muitas fases, PR + review) e o usuário preferir liberar a sessão, pode-se
     rodar em background e retomar via `SendMessage` quando a notificação de
     conclusão chegar — combine isso com o usuário antes se for o caso.

4. Não repita trabalho que o subagente já faz: não rode `/speckit-specify`,
   `/speckit-plan`, quality gates, etc. você mesmo neste skill — isso é
   responsabilidade exclusiva do subagente full-cycle.

5. Se o subagente reportar bloqueio por decisão arquitetural que exige input
   humano (conforme regra de autocorreção do agente), repasse a pergunta ao
   usuário tal como recebida e aguarde a resposta antes de retomar o subagente
   (via `SendMessage` para o mesmo agente, para preservar o contexto acumulado).

6. Ao concluir, apresente ao usuário o relatório final devolvido pelo subagente
   (Feature, Branch, PR, checklist de fases concluídas). Não reformule o
   relatório como uma lista nova — repasse-o de forma fiel e concisa.
