# Página — <Nome>

> Copie para `doc/paginas/<nome>/index.md`. Crie `src/pages/<Nome>/` junto.
> Apague estas linhas de instrução depois.

[[index|← Índice]]

**Rota:** `/<caminho>`
**Pasta:** `src/pages/<Nome>/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Uma a duas frases.

## Componentes exclusivos

Só os usados **nesta** página (`src/pages/<Nome>/components/`).
Virou global? Mova para `src/components/` + `doc/componentes/` ([[02-componentes]]).

| Componente | Arquivo | O que faz |
|---|---|---|
| `Exemplo` | `components/Exemplo.tsx` | … |

## Hooks/funções exclusivos

`pages/<Nome>/hooks/` ou `utils.ts`. Reutilizável → sobe para global ([[03-funcoes]]).

| Nome | Arquivo | O que faz |
|---|---|---|
| `useExemplo` | `hooks/useExemplo.ts` | … |

## Componentes globais usados

Linka os que já existem — para não recriar.

- [[componentes/_template|Componente X]]
