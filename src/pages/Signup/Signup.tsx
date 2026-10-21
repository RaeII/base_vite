import { Eye, EyeOff } from 'lucide-react'
import { useState, type ChangeEventHandler, type SyntheticEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ThemeToggle'
import { GoogleLoginButton } from '@/components/GoogleLoginButton'
import type { GoogleRegistrationRequired } from '../../api/auth/auth.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface PasswordInputProps {
  id: string
  label: string
  value: string
  visible: boolean
  autoComplete: string
  required?: boolean
  minLength?: number
  maxLength?: number
  'aria-invalid'?: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  onToggleVisibility: () => void
}

function PasswordInput({
  visible,
  onToggleVisibility,
  ...props
}: PasswordInputProps) {
  const Icon = visible ? EyeOff : Eye

  return (
    <div className="relative">
      <Input
        {...props}
        labelClassName="bg-card"
        type={visible ? 'text' : 'password'}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        onClick={onToggleVisibility}
      >
        <Icon />
      </Button>
    </div>
  )
}

function Signup() {
  const { isAuthenticated, signup, loginWithGoogle, registerWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Rota de origem guardada pelo RequireAuth — volta para lá após cadastrar.
  // `google`: 1º acesso pelo Google vindo do /login (só confirma o username).
  const locationState = location.state as {
    from?: { pathname: string }
    google?: GoogleRegistrationRequired
  } | null
  const from = locationState?.from?.pathname ?? '/'

  const [google, setGoogle] = useState(locationState?.google ?? null)
  const [username, setUsername] = useState(locationState?.google?.username ?? '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const passwordsMismatch =
    !google && passwordConfirmation.length > 0 && password !== passwordConfirmation
  const formError = passwordsMismatch ? 'As senhas não conferem' : error

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError(null)
    if (google && Date.now() >= new Date(google.expiresAt).getTime()) {
      setGoogle(null)
      setError('A verificação do Google expirou. Entre com o Google novamente.')
      return
    }
    if (!google && password !== passwordConfirmation) {
      return
    }

    setSubmitting(true)
    try {
      if (google) {
        await registerWithGoogle({
          registrationToken: google.registrationToken,
          username: username.trim(),
        })
      } else {
        await signup({
          username: username.trim(),
          email: email.trim(),
          password,
        })
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erro inesperado ao criar conta'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Conta já existia: entra (o <Navigate> acima redireciona). 1º acesso: confirma o username.
  async function handleGoogle(credential: string) {
    setError(null)
    setSubmitting(true)
    try {
      const result = await loginWithGoogle(credential)
      if (result.status === 'registration_required') {
        setGoogle(result)
        setUsername(result.username)
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
          <CardTitle className="text-2xl tracking-tight">Criar conta</CardTitle>
          <CardDescription>
            {google ? 'Confirme o username da sua conta Google.' : 'Cadastre seu username, email e senha.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {!google && <GoogleLoginButton onCredential={handleGoogle} disabled={submitting} />}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="username"
              label="Username"
              labelClassName="bg-card"
              type="text"
              required
              minLength={3}
              maxLength={45}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              id="email"
              label="Email"
              labelClassName="bg-card"
              type="email"
              required
              maxLength={45}
              autoComplete="email"
              disabled={google !== null}
              value={google ? google.email : email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {!google && (
              <>
                <PasswordInput
                  id="password"
                  label="Senha"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={password}
                  visible={passwordVisible}
                  onChange={(e) => setPassword(e.target.value)}
                  onToggleVisibility={() => setPasswordVisible((visible) => !visible)}
                />

                <PasswordInput
                  id="password-confirmation"
                  label="Confirmar senha"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  visible={passwordConfirmationVisible}
                  aria-invalid={passwordsMismatch || undefined}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  onToggleVisibility={() =>
                    setPasswordConfirmationVisible((visible) => !visible)
                  }
                />
              </>
            )}

            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting || passwordsMismatch}
              className="w-full"
            >
              {submitting ? 'Criando…' : 'Criar conta'}
            </Button>

            {google ? (
              <p className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setGoogle(null)}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Cadastrar com senha
                </button>
              </p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Já tem conta?{' '}
                <Link
                  to="/login"
                  state={{ from: locationState?.from }}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Entrar
                </Link>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
