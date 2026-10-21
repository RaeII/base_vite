import { ShieldCheck } from 'lucide-react'
import { useState, type SyntheticEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ThemeToggle'
import { GoogleLoginButton } from '@/components/GoogleLoginButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface LoginProps {
  /**
   * Modo área admin (`/admin/login`): reautenticação obrigatória mesmo já logado
   * (step-up) — abre uma sessão admin elevada e volta para a área admin.
   */
  admin?: boolean
}

function Login({ admin = false }: LoginProps) {
  const { user, isAuthenticated, sessionExpired, login, adminLogin, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Admin já logado só confirma a senha: o identificador vem preenchido.
  const [identifier, setIdentifier] = useState(admin ? (user?.username ?? '') : '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Rota de origem guardada pelo RequireAuth — volta para lá após logar.
  const locationState = location.state as { from?: { pathname: string } } | null
  const from = locationState?.from?.pathname ?? (admin ? '/admin' : '/')

  if (isAuthenticated && !admin) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await (admin ? adminLogin : login)({ login: identifier, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro inesperado ao entrar')
    } finally {
      setSubmitting(false)
    }
  }

  // Conta existente entra (o <Navigate> acima redireciona); 1º acesso confirma o username no cadastro.
  async function handleGoogle(credential: string) {
    setError(null)
    setSubmitting(true)
    try {
      const result = await loginWithGoogle(credential)
      if (result.status === 'registration_required') {
        navigate('/signup', { state: { from: locationState?.from, google: result } })
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao entrar com o Google')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background px-6 text-foreground">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          {admin && (
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-accent dark:bg-secondary dark:ring-1 dark:ring-border">
              <ShieldCheck className="size-5" aria-hidden />
            </div>
          )}
          <CardTitle className="text-2xl tracking-tight">{admin ? 'Área administrativa' : 'Entrar'}</CardTitle>
          <CardDescription>
            {admin
              ? 'Acesso restrito. Confirme suas credenciais de administrador para continuar.'
              : sessionExpired
                ? 'Sua sessão expirou. Entre novamente.'
                : 'Use seu username ou email.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {!admin && <GoogleLoginButton onCredential={handleGoogle} disabled={submitting} />}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="identifier"
              label="Username ou email"
              labelClassName="bg-card"
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <Input
              id="password"
              label="Senha"
              labelClassName="bg-card"
              type="password"
              required
              autoComplete="current-password"
              autoFocus={admin && identifier !== ''}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Entrando…' : admin ? 'Entrar na área admin' : 'Entrar'}
            </Button>

            {admin ? (
              <div className="space-y-3 text-center text-sm text-muted-foreground">
                <p className="text-xs">Por segurança, a sessão de administrador expira após um curto período sem uso.</p>
                <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
                  Voltar ao sistema
                </Link>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Não tem conta?{' '}
                <Link
                  to="/signup"
                  state={{ from: locationState?.from }}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
