import {
  FlaskConical,
  LayoutDashboard,
  ScrollText,
  Server,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'

// Fonte única de navegação: AppSidebar (desktop) e MobileNav (bottom bar) leem daqui.
// Ao criar páginas reais, dê `to` (rota) — os dois consumidores passam a navegar/marcar ativo.
export type NavItem = {
  title: string
  icon: LucideIcon
  to?: string
  /** Só aparece para `useAuth().isAdmin` (atalho de UI — quem protege é o backend). */
  adminOnly?: boolean
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { title: 'Teste', icon: FlaskConical },
  { title: 'Administração', icon: ShieldCheck, to: '/admin', adminOnly: true },
]

// Área admin (AdminLayout): mesma sidebar/bottom bar, outros itens.
export const adminNavItems: NavItem[] = [
  { title: 'Visão geral', icon: LayoutDashboard, to: '/admin' },
  { title: 'Usuários', icon: Users, to: '/admin/users' },
  { title: 'Auditoria', icon: ScrollText, to: '/admin/audit' },
  { title: 'Sistema', icon: Server, to: '/admin/system' },
]

/** Itens visíveis para o usuário (esconde `adminOnly` de quem não é admin). */
export function visibleNavItems(items: NavItem[], isAdmin: boolean): NavItem[] {
  return items.filter((item) => !item.adminOnly || isAdmin)
}

// Bottom bar mobile: nº máx. de tabs diretas; o resto (e a conta) vai no drawer "Menu".
export const MOBILE_PRIMARY_COUNT = 4
