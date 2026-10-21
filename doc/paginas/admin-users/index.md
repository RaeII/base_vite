# Página — Admin · Usuários

[[index|← Índice]]

**Rota:** `/admin/users` (dentro de [[componentes/require-admin|RequireAdmin]] + [[componentes/admin-layout|AdminLayout]])
**Pasta:** `src/pages/AdminUsers/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Gestão de usuários sobre `/api/user`: busca (debounce 300 ms, volta à página 1), filtro Ativos/Inativos/Todos, tabela paginada (20/página), criar/editar em painel lateral, encerrar sessões, desativar (com confirmação) e reativar. Resultado da ação aparece numa linha de status acima da tabela.

- **Própria conta** (badge "Você"): menu só com Editar; papel e status travados no form (o backend também recusa — autoproteção).
- **Mobile:** coluna Status vira badge "Inativo" ao lado do nome; e-mail trunca para Papel/Ações caberem sem rolar.
- Menu de linha usa `DropdownMenu modal={false}` — abrir Sheet/AlertDialog a partir dele sem travar o foco.

## Componentes exclusivos

| Componente | Arquivo | O que faz |
|---|---|---|
| `UserFormSheet` | `components/UserFormSheet.tsx` | criar/editar em `Sheet`; edição envia só campos alterados; senha vazia = mantém; mostra `issues` do Zod. Remonte com `key` a cada abertura |
| `StatusLabel` | inline em `AdminUsers.tsx` | ponto + Ativo/Inativo |

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[funcoes/use-api-data|useApiData]] · [[funcoes/format|format]] · [[componentes/pagination-bar|PaginationBar]] · [[componentes/load-error|LoadError]]
- [[componentes/shadcn-ui|shadcn/ui]] — `Table`, `Tabs`, `Badge`, `Sheet`, `Switch`, `AlertDialog`, `DropdownMenu`
- [[funcoes/api|api]] — `findAllUsers`, `createUser`, `updateUser`, `deleteUser`, `revokeUserSessions`
