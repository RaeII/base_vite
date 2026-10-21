# Função/Hook — useAuth

[[index|← Índice]] · [[03-funcoes]]

**Arquivo:** `src/hooks/useAuth.ts`
**Tipo:** hook

## O que faz

Acesso ao estado de autenticação e às ações de login/signup/Google/logout. Lança erro
se usado fora de [[componentes/auth-provider|AuthProvider]].

## Assinatura

```ts
function useAuth(): AuthContextValue
```

**Retorno:**

| Campo | Tipo | Descrição |
|---|---|---|
| `user` | `User \| null` | usuário logado (null sem sessão) |
| `isAuthenticated` | `boolean` | `user !== null` |
| `isAdmin` | `boolean` | `user.is_admin` — só para UI (mostrar menu); quem autoriza é o backend |
| `sessionExpired` | `boolean` | sessão caiu sozinha (expirou/revogada), não por logout |
| `login` | `(input: LoginInput) => Promise<User>` | autentica (backend seta os cookies de sessão) |
| `adminLogin` | `(input: LoginInput) => Promise<User>` | login da área admin: reautentica e abre sessão elevada (não-admin → 401) |
| `signup` | `(input: SignupInput) => Promise<User>` | cadastra usuário comum e abre sessão |
| `loginWithGoogle` | `(credential: string) => Promise<GoogleAuthResponse>` | ID token do GIS → `authenticated` (sessão aberta) ou `registration_required` (1º acesso, nada criado) |
| `registerWithGoogle` | `(input: GoogleRegisterInput) => Promise<User>` | conclui o 1º acesso (prova + username) — cria conta sem senha e abre sessão |
| `logout` | `() => Promise<void>` | revoga a sessão no backend e limpa o estado |

## Uso

```ts
import { useAuth } from '../hooks/useAuth'

const { user, isAuthenticated, login, signup, logout } = useAuth()
await login({ login: 'usuario', password: '…' }) // login = username OU email
await signup({ username: 'novo', email: 'novo@email.com', password: 'senha-segura' })
```
