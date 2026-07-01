# Página — Login

[[index|← Índice]]

**Rota:** `/login`
**Pasta:** `src/pages/Login/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Formulário de login (username/email + senha). Autentica via `useAuth().login`,
redireciona de volta à rota de origem (guardada pelo `RequireAuth`) ou `/`.
Já autenticado → redireciona direto.

## Componentes exclusivos

Nenhum — formulário simples inline.

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[componentes/auth-provider|AuthProvider]] — via [[funcoes/use-auth|useAuth]]
- `ApiError` (`src/api/client.ts`) — mensagem de erro do backend no form
