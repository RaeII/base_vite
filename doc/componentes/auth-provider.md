# Componente — AuthProvider

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/AuthProvider.tsx`

## O que faz

Provider global de autenticação. Dono do estado da sessão: faz login/login admin/signup/Google/logout
na API e busca o usuário em `GET /auth/me` — **o servidor é a fonte da verdade**,
nada de sessão em `localStorage`. Derruba a sessão quando o interceptor do axios
avisa que o refresh foi recusado (`SESSION_EXPIRED_EVENT`). Envolve as rotas no
`App.tsx`.

## Props

| Prop | Tipo | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `children` | `ReactNode` | sim | — | árvore da aplicação |
| `fallback` | `ReactNode` | não | `null` | renderizado enquanto o `/auth/me` do boot não responde |

## Uso

```tsx
<BrowserRouter>
  <AuthProvider fallback={<PageFallback />}>
    <Routes>…</Routes>
  </AuthProvider>
</BrowserRouter>
```

Consumo nos componentes: [[funcoes/use-auth|useAuth]].

## Notas

- Tokens ficam em cookies **httpOnly** (access JWT de 15 min + refresh rotativo
  de 7 dias deslizantes) — o JS nunca lê. Access vencido é renovado em silêncio
  pelo interceptor ([[funcoes/api|api]]); o usuário só é deslogado quando a
  **sessão** acaba (refresh recusado: expirada, revogada ou reuso detectado).
- **Boot:** renderiza `fallback` até o `/auth/me` responder — quem está logado
  não vê o `/login` piscar.
- **Revalidação** (`/auth/me`) sempre que a aba volta a ficar visível: pega
  login/logout feito em outra aba, sessão revogada no servidor (troca de senha,
  desativação) ou vencida por inatividade. Erro de rede **não** desloga.
- Sessão que cai sozinha → `sessionExpired = true` (o Login avisa "Sua sessão
  expirou"); visitante sem sessão não recebe o aviso. Logout explícito também não.
- `logout()` revoga a sessão no backend e limpa o estado mesmo se a request falhar.
- `loginWithGoogle()` (`POST /auth/google`) só abre a sessão local quando a conta já existe;
  no 1º acesso devolve `registration_required` e `registerWithGoogle()`
  (`POST /auth/google/register`) cria a conta e abre a sessão.
- `adminLogin()` (`POST /auth/admin/login`) abre uma sessão **nova** que vale para
  o app e para a área admin — o estado local é atualizado igual ao login.
