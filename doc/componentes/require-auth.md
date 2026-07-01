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
- Novo grupo de permissão (ex: admin-only)? Crie guard irmão (ex: `RequireAdmin`
  checando `isAdmin`) — não infle este.
