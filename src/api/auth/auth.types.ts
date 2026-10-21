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

/** Body do login com Google: o `credential` (ID token) devolvido pelo GIS. */
export interface GoogleAuthInput {
  credential: string
}

/** 1º acesso pelo Google: a conta ainda não existe — o usuário confirma o username. */
export interface GoogleRegistrationRequired {
  status: 'registration_required'
  /** Prova assinada pelo backend (15 min) — só em memória, vai no registerWithGoogle. */
  registrationToken: string
  expiresAt: string
  /** E-mail verificado pelo Google — exibido bloqueado, não editável. */
  email: string
  /** Sugestão editável. */
  username: string
}

export type GoogleAuthResponse =
  | (LoginResponse & { status: 'authenticated' })
  | GoogleRegistrationRequired

export interface GoogleRegisterInput {
  registrationToken: string
  username: string
}
