# Função/Hook — useAuth

[[index|← Índice]] · [[03-funcoes]]

**Arquivo:** `src/hooks/useAuth.ts`
**Tipo:** hook

## O que faz

Acesso ao estado de autenticação e às ações de login/logout. Lança erro se
usado fora de [[componentes/auth-provider|AuthProvider]].

## Assinatura

```ts
function useAuth(): AuthContextValue
```

**Retorno:**

| Campo | Tipo | Descrição |
|---|---|---|
| `user` | `User \| null` | usuário logado (null sem sessão) |
| `isAuthenticated` | `boolean` | `user !== null` |
| `isAdmin` | `boolean` | `user.is_admin` |
| `login` | `(input: LoginInput) => Promise<User>` | autentica e persiste sessão |
| `logout` | `() => Promise<void>` | encerra sessão (backend + local) |

## Uso

```ts
import { useAuth } from '../hooks/useAuth'

const { user, isAuthenticated, login, logout } = useAuth()
await login({ login: 'usuario', password: '…' }) // login = username OU email
```
