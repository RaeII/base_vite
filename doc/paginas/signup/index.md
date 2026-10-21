# Página — Signup

[[index|← Índice]]

**Rota:** `/signup`
**Pasta:** `src/pages/Signup/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

`src/pages/Signup/Signup.tsx`, formulário coleta username, email obrigatório, senha com confirmação e visualizador, cria via `useAuth().signup`, persiste sessão, redireciona para a rota de origem ou `/` e usuário já autenticado redireciona direto.

`src/pages/Signup/Signup.tsx`, Google: [[componentes/google-login-button|GoogleLoginButton]] no topo → `loginWithGoogle`; conta existente entra, 1º acesso (ou `state.google` vindo do `/login`) troca o form para modo Google: email bloqueado, username sugerido editável, sem senha → `registerWithGoogle`. Prova expirada (15 min) volta ao form normal pedindo o Google de novo; "Cadastrar com senha" sai do modo Google.

## Componentes exclusivos

`src/pages/Signup/Signup.tsx`, `PasswordInput` é local porque só o Signup usa visualizador de senha, manter na página até existir segunda página usando o mesmo padrão.

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[componentes/auth-provider|AuthProvider]] — via [[funcoes/use-auth|useAuth]]
- [[componentes/google-login-button|GoogleLoginButton]] — cadastro/login com Google
- `ApiError` (`src/api/client.ts`) — mensagem de erro do backend no form
