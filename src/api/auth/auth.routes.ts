import { api } from '../client'
import type { User } from '../user/user.types'
import type { LoginInput, LoginResponse, SignupInput, SignupResponse } from './auth.types'

// Rotas /auth do backend. Os tokens vivem em cookies httpOnly (`token_access`
// e `token_refresh`) — setados no login/signup, removidos no logout. O JS nunca
// os lê. O refresh (`POST /auth/refresh`) é chamado só pelo interceptor do client.

export async function login(input: LoginInput) {
  const { data } = await api.post<LoginResponse>('/auth/login', input)
  return data
}

/**
 * Login da área admin (step-up): reautentica e abre uma sessão NOVA elevada
 * (expira após 15 min sem uso). Não-admin recebe o mesmo 401 de senha errada.
 * A sessão também vale para o sistema principal.
 */
export async function adminLogin(input: LoginInput) {
  const { data } = await api.post<LoginResponse>('/auth/admin/login', input)
  return data
}

export async function signup(input: SignupInput) {
  const { data } = await api.post<SignupResponse>('/auth/signup', input)
  return data
}

/** Usuário da sessão atual (fonte da verdade). 401 sem sessão válida. */
export async function me() {
  const { data } = await api.get<{ data: User }>('/auth/me')
  return data.data
}

export async function logout() {
  await api.post('/auth/logout')
}
