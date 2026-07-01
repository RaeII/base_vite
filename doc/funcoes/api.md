# Função/Hook — api (cliente HTTP)

[[index|← Índice]] · [[03-funcoes]]

**Pasta:** `src/api/`
**Tipo:** cliente axios + funções de rota por módulo

## O que faz

Toda comunicação com o backend. Uma pasta por módulo da API — **nunca** chame
axios/fetch direto de página/componente; crie a função aqui.

```
src/api/
  client.ts           → instância axios + ApiError + interceptor 401
  auth/
    auth.routes.ts    → login(), logout()
    auth.types.ts     → LoginInput, LoginResponse
  user/
    user.routes.ts    → findAllUsers(), findUserById(), createUser(), updateUser(), deleteUser()
    user.types.ts     → User, CreateUserInput, Paginated<T>
```

## client.ts

- `baseURL: '/api'` — dev: proxy do Vite (`vite.config.ts`, alvo em
  `VITE_API_TARGET`); produção: reverse proxy. Browser nunca fala direto com o backend.
- `withCredentials: true` — envia cookie httpOnly `token_access` (o JS nunca lê o token).
- Interceptor: toda falha vira `ApiError { status, message, details }`
  (`status 0` = rede/timeout); 401 fora do login dispara `SESSION_EXPIRED_EVENT`
  → [[componentes/auth-provider|AuthProvider]] derruba a sessão.

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
