# Componente — AdminLayout

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/AdminLayout.tsx`

## O que faz

Shell da área admin (rota-layout com `<Outlet />`): [[componentes/app-sidebar|AppSidebar]] e [[componentes/mobile-nav|MobileNav]] com `adminNavItems` (`src/lib/nav.ts`), header "Área administrativa" (escudo dourado = modo admin) com "Voltar ao sistema", e `Suspense` local — trocar de página admin não derruba o shell.

## Props

Nenhuma.

## Uso

```tsx
<Route element={<RequireAdmin />}>
  <Route element={<AdminLayout />}>…páginas admin…</Route>
</Route>
```

## Notas

- Não checa acesso — vai **dentro** do [[componentes/require-admin|RequireAdmin]].
- Carregado com `lazy` no `App.tsx` (export nomeado → `.then((m) => ({ default: m.AdminLayout }))`).
- Página nova da área admin: rota filha aqui + item em `adminNavItems`.
