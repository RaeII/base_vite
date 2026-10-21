import { createContext, useContext } from 'react'
import type { LoginInput, SignupInput } from '../api/auth/auth.types'
import type { User } from '../api/user/user.types'

export interface AuthContextValue {
  /** Usuário logado, ou null sem sessão. */
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  /** true quando a sessão caiu sozinha (expirou/revogada), não por logout. */
  sessionExpired: boolean
  /** Autentica no backend (seta os cookies httpOnly de sessão). */
  login: (input: LoginInput) => Promise<User>
  /** Login da área admin: reautentica e abre sessão elevada (15 min sem uso). */
  adminLogin: (input: LoginInput) => Promise<User>
  /** Cria conta no backend (seta os cookies httpOnly de sessão). */
  signup: (input: SignupInput) => Promise<User>
  /** Revoga a sessão no backend e limpa o estado local. */
  logout: () => Promise<void>
}

// Preenchido pelo <AuthProvider> (src/components/AuthProvider.tsx).
export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
