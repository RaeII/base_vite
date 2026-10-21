# Página — Login

[[index|← Índice]]

**Rota:** `/login` · `/admin/login` (`<Login admin />`)
**Pasta:** `src/pages/Login/`
**Carregamento:** lazy ([[04-performance]])

## O que faz

Formulário de login (username/email + senha). Autentica via `useAuth().login`,
redireciona de volta à rota de origem (guardada pelo `RequireAuth`) ou `/`.
Já autenticado → redireciona direto. Sessão que caiu sozinha
(`useAuth().sessionExpired`) → a descrição do card vira "Sua sessão expirou.
Entre novamente."

**Modo admin (`admin`, rota `/admin/login`):** login da área administrativa
(step-up). Usa `useAuth().adminLogin`; **não** redireciona quem já está logado
(reautenticação obrigatória) e pré-preenche o username da sessão. Volta para
`state.from` ou `/admin`. Escudo dourado, "Voltar ao sistema" no lugar de
"Criar conta". Não-admin recebe "Credenciais inválidas" (igual senha errada).
A rota usa `key="admin"` para não herdar o estado do `/login`.

## Componentes exclusivos

Nenhum — formulário simples inline.

## Hooks/funções exclusivos

Nenhum.

## Componentes globais usados

- [[componentes/auth-provider|AuthProvider]] — via [[funcoes/use-auth|useAuth]]
- `ApiError` (`src/api/client.ts`) — mensagem de erro do backend no form
