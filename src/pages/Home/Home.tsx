import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '@/components/ui/button'

function Swatch({
  name,
  desc,
  className,
}: {
  name: string
  desc: string
  className: string
}) {
  return (
    <div className={`rounded-xl p-5 ${className}`}>
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-xs opacity-80">{desc}</div>
    </div>
  )
}

function Home() {
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">base_vite</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.username}</span>
          <Button variant="outline" size="sm" onClick={toggle}>
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight">Tailwind v4 base</h1>
        <p className="mt-3 text-muted-foreground">
          Navy, creme e terracota — tema claro e escuro.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Swatch
            name="Primary"
            desc="Navy ↔ Creme"
            className="bg-primary text-primary-foreground"
          />
          <Swatch
            name="Secondary"
            desc="Superfície"
            className="bg-secondary text-secondary-foreground"
          />
          <Swatch
            name="Accent"
            desc="Terracota (auxiliar) · #C46A4A"
            className="bg-accent text-accent-foreground"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            Accent
          </Button>
          <Button variant="outline">Outline</Button>
        </div>

        <div className="mt-10 rounded-xl border bg-card p-6 text-card-foreground">
          <h2 className="font-semibold">Card surface</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            bg-card / border / text-muted-foreground — todos reagem ao tema.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Home
