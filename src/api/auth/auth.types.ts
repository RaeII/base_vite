import type { User } from '../user/user.types'

/**
 * Credenciais de login. `login` aceita username OU email —
 * o backend resolve o identificador.
 */
export interface LoginInput {
  login: string
  password: string
}

export interface SignupInput {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  data: User
  /** TTL do access token em segundos — renovado em silêncio pelo refresh token. */
  expiresIn: number
}

export type SignupResponse = LoginResponse
