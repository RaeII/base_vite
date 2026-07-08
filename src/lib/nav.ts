import { FlaskConical, LayoutDashboard, type LucideIcon } from 'lucide-react'

// Fonte única de navegação: AppSidebar (desktop) e MobileNav (bottom bar) leem daqui.
// Ao criar páginas reais, dê `to` (rota) — os dois consumidores passam a navegar/marcar ativo.
export type NavItem = {
  title: string
  icon: LucideIcon
  to?: string
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { title: 'Teste', icon: FlaskConical },
]

// Bottom bar mobile: nº máx. de tabs diretas; o resto (e a conta) vai no drawer "Menu".
export const MOBILE_PRIMARY_COUNT = 4
