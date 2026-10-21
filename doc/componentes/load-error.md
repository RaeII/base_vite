# Componente — LoadError

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/LoadError.tsx`

## O que faz

Falha ao carregar dados: mensagem (`role="alert"`) + botão "Tentar de novo". Par natural do [[funcoes/use-api-data|useApiData]] (`error` / `reload`).

## Props

| Prop | Tipo | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `message` | `string` | sim | — | `error` do hook |
| `onRetry` | `() => void` | sim | — | `reload` do hook |
| `className` | `string` | não | — | classes extras |

## Uso

```tsx
{users.error && !users.data && <LoadError message={users.error} onRetry={users.reload} />}
```
