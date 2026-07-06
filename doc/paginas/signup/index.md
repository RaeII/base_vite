# Página — Signup

[[index|← Índice]]

**Rota:** `/signup`
**Pasta:** `src/pages/Signup/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

`src/pages/Signup/Signup.tsx`, formulário coleta username, email obrigatório, senha com confirmação e visualizador, cria via `useAuth().signup`, persiste sessão, redireciona para a rota de origem ou `/` e usuário já autenticado redireciona direto.

## Componentes exclusivos

`src/pages/Signup/Signup.tsx`, `PasswordInput` é local porque só o Signup usa visualizador de senha, manter na página até existir segunda página usando o mesmo padrão.

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[componentes/auth-provider|AuthProvider]] — via [[funcoes/use-auth|useAuth]]
- `ApiError` (`src/api/client.ts`) — mensagem de erro do backend no form
