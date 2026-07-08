# MobileNav

Navegação mobile: **bottom bar** fixa (padrão tab bar de app) + **drawer lateral** para o overflow. Só aparece em `< md`; no desktop quem navega é a [[componentes/app-sidebar|AppSidebar]]. Complementar à sidebar — os dois leem a **mesma** fonte de menus (`src/lib/nav.ts`), sem duplicar.

- **Local:** `src/components/MobileNav.tsx` (global).
- **Props:** nenhuma — lê menus de `src/lib/nav.ts`, usuário/logout de [[funcoes/use-auth|useAuth]].
- **Depende de:** `ui/sheet`, `ui/avatar`, [[componentes/theme-toggle|ThemeToggle]], [[funcoes/use-auth|useAuth]], `react-router-dom` (`NavLink`).
- **Precisa de Router acima** (usa `NavLink`/`useLocation`) e do `AuthProvider`. Renderize dentro de `<SidebarInset>` (ex.: `src/pages/Home/Home.tsx`).

## Layout

- **Bottom bar (`nav` fixa):** até **4 tabs diretas** (`MOBILE_PRIMARY_COUNT`) + **último slot "Menu"** que abre o drawer. Ativo marcado com pílula (`bg-primary/10`) — padrão Material. `pb-[env(safe-area-inset-bottom)]` respeita o notch.
- **Drawer (`Sheet side="right"`, direita→esquerda):** header (logo), **nav completa** (todos os itens) e rodapé de **conta** (avatar + nome/e-mail, [[componentes/theme-toggle|ThemeToggle]], Sair). Itens com `to` fecham o drawer ao navegar (`SheetClose`).

## Fonte de menus (`src/lib/nav.ts`)

`navItems[]` é a **fonte única** (sidebar + mobile). Item sem `to` = placeholder inerte; ao criar a página real, dê `to` → navega e marca ativo nos dois. Bar mostra `slice(0, MOBILE_PRIMARY_COUNT)`; o resto fica só no drawer.

## Por que não reusar a sidebar-como-drawer

O primitivo `sidebar` já vira Sheet no mobile, mas sem trigger visível e com a UX de desktop (colapso por ícone). A bottom bar é o padrão nativo de mobile (alvo grande no polegar) — daí um componente próprio, fino, compondo o `Sheet` do shadcn.

## Uso

```tsx
import { MobileNav } from '@/components/MobileNav'

<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    {/* conteúdo (adicione pb-24 md:pb-* p/ não ficar atrás da barra) */}
    <MobileNav />
  </SidebarInset>
</SidebarProvider>
```
