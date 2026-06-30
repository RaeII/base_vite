# 03 — Funções e hooks

[[index|← Índice]] · [[01-estrutura]]

Mesma lógica dos [[02-componentes|componentes]]: global vs. local.

## Onde mora

| Tipo | Usado por 1 página | Usado por 2+ páginas |
|---|---|---|
| Função pura (sem React) | `pages/<Pagina>/utils.ts` | `src/lib/` |
| Hook (`use…`) | `pages/<Pagina>/hooks/` | `src/hooks/` |

Comece local. Na segunda página que precisar, **promova e documente** — não copie.

## Função/hook global → doc obrigatória

Tudo em `src/lib/` ou `src/hooks/` é documentado em `doc/funcoes/`
(copie [[funcoes/_template|o template]]): **assinatura**, **parâmetros**,
**retorno**, **exemplo**.

## Como escrever

- **Funções puras** quando der: mesma entrada → mesma saída, sem efeito colateral.
  Fáceis de testar, reusar e memoizar.
- Tipar entrada e saída. Sem `any`.
- Hook só se usar API de React (`useState`, `useEffect`, etc.). Senão, função pura.
- Um hook = uma responsabilidade.

## Exemplo já no projeto

`useTheme` (`src/hooks/useTheme.ts`) — hook global, tema claro/escuro.
É o modelo: pequeno, tipado, reutilizável.

## Antes de criar — procure

```bash
rg -l "funcaoProvavel|useAlgo" src/lib src/hooks src/pages
```
