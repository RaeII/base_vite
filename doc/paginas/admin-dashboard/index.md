# Página — Admin · Visão geral

[[index|← Índice]]

**Rota:** `/admin` (dentro de [[componentes/require-admin|RequireAdmin]] + [[componentes/admin-layout|AdminLayout]])
**Pasta:** `src/pages/AdminDashboard/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Painel inicial da área admin: faixa de números (`GET /admin/stats` — ativos, inativos, admins, novos 7d, logins 24h, sessões), últimas 8 ações da auditoria (`GET /admin/audit`) e resumo de saúde (`GET /admin/system`). Cada bloco carrega e falha sozinho (skeleton / [[componentes/load-error|LoadError]]).

## Componentes exclusivos

| Componente | Arquivo | O que faz |
|---|---|---|
| `Stat` | inline em `AdminDashboard.tsx` | célula da faixa de números (`dt`/`dd`) |
| `SectionHeader` | inline em `AdminDashboard.tsx` | título de seção + link "ver mais" |

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[funcoes/use-api-data|useApiData]] · [[funcoes/format|format]] · [[componentes/health-indicator|HealthIndicator]] · [[componentes/load-error|LoadError]]
