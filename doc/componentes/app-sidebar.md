# AppSidebar

Sidebar do app (shell de navegação), montada sobre o primitivo [[componentes/shadcn-ui|shadcn `sidebar`]]. Usa `variant="inset"`: sidebar e conteúdo **flutuam com margem** (não encostam nas bordas), e o `SidebarInset` vira um card arredondado com sombra — layout moderno, com respiro. Colapsável para ícones (`collapsible="icon"`), com atalho `Ctrl/Cmd+B` e versão mobile em drawer (herdados do primitivo).

O respiro é o padrão do shadcn (`8px`, via `p-2`/`m-2` no primitivo). Para mais ar, suba esses valores em `src/components/ui/sidebar.tsx`.

- **Local:** `src/components/AppSidebar.tsx` (global).
- **Props:** nenhuma — lê usuário/logout de [[funcoes/use-auth|useAuth]].
- **Depende de:** `ui/sidebar`, `ui/dropdown-menu`, `ui/avatar`, [[componentes/theme-toggle|ThemeToggle]], [[funcoes/use-auth|useAuth]].
- **Precisa de `<SidebarProvider>` acima** (e do `useAuth`/AuthProvider). Renderize ao lado de `<SidebarInset>`.

## Layout

- **Topo (`SidebarHeader`):** ícone + nome do projeto (`base_vite`, estático) + **único** botão de toggle (`SidebarTrigger`), sempre **abaixo** da logo (mesma altura nos dois estados). Aberto → `<` alinhado à direita (nome visível). Recolhido → `>` centrado (nome some). Sem `SidebarRail` (barra da borda removida).
- **Meio (`SidebarContent`):** menus de **teste** (`Dashboard`, `Teste`) — placeholders sem rota. Trocar pelos reais em `menus[]` (dar `onClick`/link e `isActive`).
- **Rodapé (`SidebarFooter`):** avatar + nome/e-mail do usuário; clique abre dropdown com **Tema** (o [[componentes/theme-toggle|ThemeToggle]], linha que não fecha o menu) e **Sair** (`logout`).

## Cores

Usa os tokens `--sidebar*` de `src/index.css`, que são **aliases** dos tokens da marca (`--card`, `--primary`, `--secondary`, …). Reage ao tema sozinho; não há paleta própria.

## Uso

```tsx
import { AppSidebar } from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    {/* toggle vive dentro da própria sidebar (header), não aqui */}
    {/* conteúdo da página */}
  </SidebarInset>
</SidebarProvider>
```

Exemplo real: `src/pages/Home/Home.tsx`.
