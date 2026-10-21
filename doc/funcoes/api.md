# Função/Hook — api (cliente HTTP)

[[index|← Índice]] · [[03-funcoes]]

**Pasta:** `src/api/`
**Tipo:** cliente axios + funções de rota por módulo

## O que faz

Toda comunicação com o backend. Uma pasta por módulo da API — **nunca** chame
axios/fetch direto de página/componente; crie a função aqui.

```
src/api/
  client.ts           → instância axios + ApiError + interceptor 401 (refresh silencioso)
  auth/
    auth.routes.ts    → login(), adminLogin(), signup(), me(), logout()
    auth.types.ts     → LoginInput, SignupInput, LoginResponse, SignupResponse
  user/
    user.routes.ts    → findAllUsers({ page, limit, search, status }), findUserById(), createUser(),
                        updateUser(), deleteUser(), revokeUserSessions()
    user.types.ts     → User, CreateUserInput, ListUsersParams, UserStatus, Paginated<T>
  admin/
    admin.routes.ts   → adminMe(), getAdminStats(), getSystemInfo(), findAuditLog()
    admin.types.ts    → AdminStats, SystemInfo, AuditEntry, HealthStatus
```

## client.ts

- `baseURL: '/api'` — dev: proxy do Vite (`vite.config.ts`, alvo em
  `VITE_API_URL`); produção: reverse proxy. Browser nunca fala direto com o backend.
- `withCredentials: true` — envia os cookies httpOnly `token_access` (JWT de
  15 min) e `token_refresh` (o JS nunca lê os tokens).
- Interceptor: toda falha vira `ApiError { status, message, details }`
  (`status 0` = rede/timeout).
- **401 = access vencido** (exceto em `/auth/login`, `/auth/admin/login` e `/auth/refresh`): chama
  `POST /auth/refresh` **uma vez** e repete a request original — transparente
  para quem chamou. Requests que tomam 401 juntas esperam a **mesma** renovação
  (single-flight), em vez de cada uma rotacionar o refresh token.
- Refresh recusado = sessão acabou → dispara `SESSION_EXPIRED_EVENT` →
  [[componentes/auth-provider|AuthProvider]] derruba a sessão e o
  [[componentes/require-auth|RequireAuth]] leva ao `/login` (sem reload,
  guardando a rota de origem).
- `403` **não** desloga — é "sem permissão". Dispara `FORBIDDEN_EVENT`: na área
  admin o [[componentes/require-admin|RequireAdmin]] escuta e volta ao login admin
  (sessão admin expirou). Rotas `/user` e `/admin` exigem sessão admin elevada.

## Uso

```ts
import { findAllUsers } from '../api/user/user.routes'
import { ApiError } from '../api/client'

try {
  const { data, pagination } = await findAllUsers({ page: 1, limit: 20 })
} catch (err) {
  if (err instanceof ApiError) console.error(err.status, err.message)
}
```

## Novo módulo da API

1. Crie `src/api/<modulo>/<modulo>.routes.ts` + `<modulo>.types.ts`.
2. Importe `api` de `../client`. Sem barrel file — importe direto ([[04-performance]]).
