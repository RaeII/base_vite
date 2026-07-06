# Página — Signup

[[index|← Índice]]

**Rota:** `/signup`
**Pasta:** `src/pages/Signup/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Formulário público de cadastro (username, email opcional e senha). Cria a conta
via `useAuth().signup`, persiste a sessão retornada pelo backend e redireciona
para a rota de origem (guardada pelo `RequireAuth`) ou `/`. Já autenticado →
redireciona direto.

## Componentes exclusivos

Nenhum — formulário simples inline.

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[componentes/auth-provider|AuthProvider]] — via [[funcoes/use-auth|useAuth]]
- `ApiError` (`src/api/client.ts`) — mensagem de erro do backend no form
