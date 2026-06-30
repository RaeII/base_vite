# 02 — Componentes

[[index|← Índice]] · [[01-estrutura]]

## Global ou local?

| Situação | Local | Decisão |
|---|---|---|
| Usado por **1 página** | `src/pages/<Pagina>/components/` | fica na página |
| Usado por **2+ páginas** | `src/components/` | é **global** |

Na dúvida, comece **local**. Quando a segunda página precisar, **promova**
(mova para `src/components/`, documente). Nunca copie e cole.

## Componente global → doc obrigatória

Sem doc, ninguém acha e o componente é reescrito. Todo componente em
`src/components/` tem uma página em `doc/componentes/` (copie [[componentes/_template|o template]]).

A doc precisa de: **o que faz**, **props** (tabela com tipos), **exemplo de uso**.

## Como escrever o componente

- Props tipadas. Sem `any`.
- Uma responsabilidade. Componente grande → quebre em menores.
- Sem estado que não usa. Estado mora o mais perto possível de quem o lê.
- Estilo via Tailwind (classes), como o resto do projeto.
- Cuidado com re-render. Detalhes em [[04-performance]].

## Antes de criar — procure

```bash
rg -l "NomeProvavel" src/components src/pages
```

Já existe algo parecido? Reutilize ou estenda. [[index#Regra de ouro|Regra de ouro]].
