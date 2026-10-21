# Página — Admin · Sistema

[[index|← Índice]]

**Rota:** `/admin/system` (dentro de [[componentes/require-admin|RequireAdmin]] + [[componentes/admin-layout|AdminLayout]])
**Pasta:** `src/pages/AdminSystem/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Informações do servidor (`GET /admin/system`), botão Atualizar: saúde + pools (fila > 0 em vermelho), aplicação (ambiente, Node, uptime, memória), banco (versão, tamanho, conexões), sessões/tokens (TTLs, sessão admin) e segurança HTTP (autorização, rate limits, cookie, CORS, proxies).

- **Só leitura** — config vem do `.env` do servidor. O backend nunca envia segredos.
- `AUTHORIZATION` desligada aparece em vermelho.

## Componentes exclusivos

| Componente | Arquivo | O que faz |
|---|---|---|
| `Panel` / `Row` / `PoolRow` | inline em `AdminSystem.tsx` | seção com título · linha `dt`/`dd` · linha da tabela de pools |

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[funcoes/use-api-data|useApiData]] · [[funcoes/format|format]] (`formatBytes`, `formatDuration`) · [[componentes/health-indicator|HealthIndicator]] · [[componentes/load-error|LoadError]]
