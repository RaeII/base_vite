# Página — Home

[[index|← Índice]]

**Rota:** `/` (autenticada — dentro de [[componentes/require-auth|RequireAuth]])
**Pasta:** `src/pages/Home/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Página inicial pós-login. Mostra o showcase do tema (paleta/tokens) + header
com username, toggle de tema e botão de logout.

## Componentes exclusivos

| Componente | Arquivo | O que faz |
|---|---|---|
| `Swatch` | inline em `Home.tsx` | card de amostra de cor da paleta |

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[componentes/require-auth|RequireAuth]] — protege a rota
- [[componentes/shadcn-ui|shadcn/ui]] — `Button` (header e showcase)
- [[funcoes/use-auth|useAuth]] — `user` e `logout`
- `useTheme` — toggle claro/escuro
