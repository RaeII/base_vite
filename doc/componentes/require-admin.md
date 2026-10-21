# Componente — RequireAdmin

[[index|← Índice]] · [[02-componentes]]

**Arquivo:** `src/components/RequireAdmin.tsx`

## O que faz

Rota-layout que protege a área admin. Exige **sessão admin elevada** (login em `/admin/login`), não só `isAdmin`: ao entrar chama `GET /admin/me`. Sem sessão, sem elevação ou quando ela expira no meio do uso (qualquer `403` → `FORBIDDEN_EVENT` do [[funcoes/api|client]]) → `<Navigate to="/admin/login">` guardando `state.from`.

## Props

| Prop | Tipo | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `fallback` | `ReactNode` | não | `null` | renderizado enquanto o `/admin/me` não responde |

## Uso

```tsx
<Route element={<RequireAdmin fallback={<PageFallback />} />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin" element={<AdminDashboard />} />
  </Route>
</Route>
```

## Notas

- Irmão do [[componentes/require-auth|RequireAuth]], **não** aninhado nele: sem sessão o destino é o login admin, não o `/login`.
- `isAdmin` do [[funcoes/use-auth|useAuth]] é só UI (mostrar o menu). Quem autoriza é o backend, a cada request.
- Elevação expira por inatividade (15 min default) ou teto (8 h) → próxima request dá `403` → volta ao login admin; a sessão de usuário segue viva.
