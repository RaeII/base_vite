# Componente — HealthIndicator

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/HealthIndicator.tsx`

## O que faz

Status do health check como ponto + rótulo: `ok` → Operacional (`success`), `degraded` → Degradado (`accent`), `down` → Fora do ar (`destructive`).

## Props

| Prop | Tipo | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `status` | `'ok' \| 'degraded' \| 'down'` | sim | — | `health.status` de `GET /admin/system` |
| `className` | `string` | não | — | classes extras |

## Uso

```tsx
<HealthIndicator status={info.health.status} />
```

Usado em [[paginas/admin-dashboard/index|Visão geral]] e [[paginas/admin-system/index|Sistema]].
