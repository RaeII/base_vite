import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  adminLogin as apiAdminLogin,
  login as apiLogin,
  loginWithGoogle as apiLoginWithGoogle,
  logout as apiLogout,
  me as apiMe,
  registerWithGoogle as apiRegisterWithGoogle,
  signup as apiSignup,
} from '../api/auth/auth.routes'
import type { GoogleRegisterInput, LoginInput, SignupInput } from '../api/auth/auth.types'
import { SESSION_EXPIRED_EVENT } from '../api/client'
import type { User } from '../api/user/user.types'
import { AuthContext } from '../hooks/useAuth'

/**
 * Sessão = dois cookies httpOnly que o JS nunca lê: access token (JWT curto) e
 * refresh token rotativo. O servidor é a fonte da verdade: o usuário vem de
 * GET /auth/me no boot e sempre que a aba volta a ficar visível. Access vencido
 * é renovado em silêncio pelo interceptor (src/api/client.ts); se o refresh é
 * recusado, SESSION_EXPIRED_EVENT derruba a sessão e o RequireAuth leva ao login.
 */
interface SessionState {
  user: User | null
  expired: boolean
}

const LOGGED_OUT: SessionState = { user: null, expired: false }

interface AuthProviderProps {
  children: ReactNode
  /** Renderizado enquanto o servidor confirma a sessão no boot. */
  fallback?: ReactNode
}

export function AuthProvider({ children, fallback = null }: AuthProviderProps) {
  const [session, setSession] = useState<SessionState>(LOGGED_OUT)
  const [checking, setChecking] = useState(true)

  // Boot + aba voltando a ficar visível: pega login/logout feito em outra aba,
  // sessão revogada no servidor (troca de senha, desativação) ou vencida.
  useEffect(() => {
    // 401 já é tratado pelo interceptor (refresh ou SESSION_EXPIRED_EVENT);
    // erro de rede mantém o estado atual em vez de deslogar por oscilação.
    const revalidate = () =>
      apiMe()
        .then((user) => setSession({ user, expired: false }))
        .catch(() => {})
        .finally(() => setChecking(false))

    void revalidate()
    const onVisible = () => {
      if (document.visibilityState === 'visible') void revalidate()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  // Refresh recusado. Só marca "expirada" se havia usuário (visitante não vê aviso).
  useEffect(() => {
    const onExpired = () => setSession((s) => (s.user ? { user: null, expired: true } : s))
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const { data: loggedUser } = await apiLogin(input)
    setSession({ user: loggedUser, expired: false })
    return loggedUser
  }, [])

  // Login admin abre uma sessão nova (também de usuário): o estado local segue o mesmo.
  const adminLogin = useCallback(async (input: LoginInput) => {
    const { data: adminUser } = await apiAdminLogin(input)
    setSession({ user: adminUser, expired: false })
    return adminUser
  }, [])

  const signup = useCallback(async (input: SignupInput) => {
    const { data: createdUser } = await apiSignup(input)
    setSession({ user: createdUser, expired: false })
    return createdUser
  }, [])

  // Google: conta existente abre a sessão; 1º acesso só devolve os dados a confirmar.
  const loginWithGoogle = useCallback(async (credential: string) => {
    const result = await apiLoginWithGoogle({ credential })
    if (result.status === 'authenticated') setSession({ user: result.data, expired: false })
    return result
  }, [])

  const registerWithGoogle = useCallback(async (input: GoogleRegisterInput) => {
    const { data: createdUser } = await apiRegisterWithGoogle(input)
    setSession({ user: createdUser, expired: false })
    return createdUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      // Limpa local mesmo se a request falhar — a sessão expira sozinha no servidor.
      setSession(LOGGED_OUT)
    }
  }, [])

  const value = useMemo(
    () => ({
      user: session.user,
      isAuthenticated: session.user !== null,
      isAdmin: session.user?.is_admin ?? false,
      sessionExpired: session.expired,
      login,
      adminLogin,
      signup,
      loginWithGoogle,
      registerWithGoogle,
      logout,
    }),
    [session, login, adminLogin, signup, loginWithGoogle, registerWithGoogle, logout],
  )

  // Sem isso, quem está logado veria o /login piscar até o /auth/me responder.
  if (checking) return fallback

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
