import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'

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
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight">Tailwind v4 base</h1>
        <p className="mt-3 text-muted-foreground">
          Luxo, confiança e simplicidade — tema claro e escuro.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Swatch
            name="Primary"
            desc="Confiança"
            className="bg-primary text-primary-foreground"
          />
          <Swatch
            name="Secondary"
            desc="Simplicidade"
            className="bg-secondary text-secondary-foreground"
          />
          <Swatch
            name="Accent"
            desc="Luxo (auxiliar)"
            className="bg-accent text-accent-foreground"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90">
            Primary
          </button>
          <button className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition hover:opacity-90">
            Accent
          </button>
          <button className="rounded-lg border px-4 py-2 font-medium transition-colors hover:bg-muted">
            Outline
          </button>
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
