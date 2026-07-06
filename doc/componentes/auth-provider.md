# Componente — AuthProvider

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/AuthProvider.tsx`

## O que faz

Provider global de autenticação. Dono do estado da sessão: faz login/signup/logout
na API, espelha `{ user, expiresAt }` em `localStorage` (chave `auth.session`)
para sobreviver a reload, e derruba a sessão quando o interceptor do axios detecta
401 (`SESSION_EXPIRED_EVENT`). Envolve as rotas no `App.tsx`.

## Props

| Prop | Tipo | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `children` | `ReactNode` | sim | — | árvore da aplicação |

## Uso

```tsx
<BrowserRouter>
  <AuthProvider>
    <Routes>…</Routes>
  </AuthProvider>
</BrowserRouter>
```

Consumo nos componentes: [[funcoes/use-auth|useAuth]].

## Notas

- Token JWT fica em cookie **httpOnly** — o JS nunca lê. `localStorage` guarda
  só o espelho da sessão (usuário + validade) para UX; autenticação real é o cookie.
- Sessão local expirada no boot → limpa e começa deslogado.
- `logout()` limpa local mesmo se a request falhar (cookie expira sozinho).
