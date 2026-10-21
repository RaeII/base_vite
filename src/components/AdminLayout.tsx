import { Suspense } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { adminNavItems } from '@/lib/nav'
import { AppSidebar } from '@/components/AppSidebar'
import { MobileNav } from '@/components/MobileNav'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

/**
 * Shell da área admin (rota-layout): mesma AppSidebar/MobileNav do app com os
 * itens de `adminNavItems`, header marcando o modo admin e as páginas no <Outlet />.
 * Vai DENTRO do <RequireAdmin /> — não faz checagem de acesso.
 */
export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar items={adminNavItems} subtitle="Administração" />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-3 border-b px-4 md:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" aria-hidden />
            <span className="text-sm font-semibold tracking-tight">Área administrativa</span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft />
              Voltar ao sistema
            </Link>
          </Button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-24 md:px-6 md:pt-8 md:pb-10">
          {/* Suspense local: trocar de página admin mantém o shell (sem fallback de tela cheia). */}
          <Suspense fallback={<span className="text-sm text-muted-foreground">Carregando…</span>}>
            <Outlet />
          </Suspense>
        </main>

        <MobileNav items={adminNavItems} />
      </SidebarInset>
    </SidebarProvider>
  )
}
