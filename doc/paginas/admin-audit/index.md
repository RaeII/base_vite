# Página — Admin · Auditoria

[[index|← Índice]]

**Rota:** `/admin/audit` (dentro de [[componentes/require-admin|RequireAdmin]] + [[componentes/admin-layout|AdminLayout]])
**Pasta:** `src/pages/AdminAudit/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Trilha de auditoria (`GET /admin/audit`, 25/página, mais recentes primeiro): quando, quem, ação + alvo, detalhes (campos alterados, nome do token) e IP. Só leitura — o backend grava o registro na mesma transação da ação.

## Componentes exclusivos

Nenhum.

## Hooks/funções exclusivos

Nenhum — rótulos vêm de `formatAuditAction`/`formatAuditDetail` ([[funcoes/format|format]]).

## Componentes globais usados

- [[funcoes/use-api-data|useApiData]] · [[componentes/pagination-bar|PaginationBar]] · [[componentes/load-error|LoadError]]
