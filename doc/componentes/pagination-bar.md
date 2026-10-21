# Componente — PaginationBar

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/PaginationBar.tsx`

## O que faz

Rodapé de lista paginada do backend: "1–20 de 57", "Página X de Y" (≥ sm) e Anterior/Próxima.

## Props

| Prop | Tipo | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `pagination` | `PaginationMeta` | sim | — | `pagination` da resposta (`src/api/user/user.types.ts`) |
| `onPageChange` | `(page: number) => void` | sim | — | nova página |
| `disabled` | `boolean` | não | — | trava os botões (ex.: carregando) |

## Uso

```tsx
<PaginationBar pagination={list.pagination} onPageChange={setPage} disabled={loading} />
```
