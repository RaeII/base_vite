# Componente — RequireAuth

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/RequireAuth.tsx`

## O que faz

Rota-layout que protege rotas filhas. Sem sessão → `<Navigate to="/login">`
guardando a rota de origem em `state.from` (o Login devolve o usuário lá
após autenticar). Com sessão → renderiza `<Outlet />`.

## Props

Nenhuma — usa [[funcoes/use-auth|useAuth]] internamente.

## Uso

```tsx
<Route element={<RequireAuth />}>
  <Route path="/" element={<Home />} />
  {/* toda rota autenticada entra aqui */}
</Route>
```

## Notas

- Depende de estar dentro de [[componentes/auth-provider|AuthProvider]] e do router.
- Também é quem tira o usuário da tela quando a sessão cai (refresh recusado):
  o AuthProvider zera o usuário e este guard redireciona, mantendo `state.from`.
  Não precisa de estado de "carregando" — o AuthProvider só renderiza as rotas
  depois que o `/auth/me` do boot responde.
- Novo grupo de permissão? Crie guard irmão — não infle este. Exemplo:
  [[componentes/require-admin|RequireAdmin]] (área admin).
