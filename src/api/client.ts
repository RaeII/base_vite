import axios, { AxiosError } from 'axios'

/**
 * Erro normalizado da API. Toda falha de request vira `ApiError`,
 * então as telas só precisam tratar um formato.
 */
export class ApiError extends Error {
  /** HTTP status (0 = erro de rede/timeout, sem resposta do servidor) */
  status: number
  /** Corpo bruto da resposta de erro, quando existir */
  details: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

/** Disparado no `window` quando a API responde 401 fora do login (sessão expirada). */
export const SESSION_EXPIRED_EVENT = 'api:session-expired'

/**
 * Cliente axios único da aplicação.
 * - `baseURL: '/api'` — em dev o proxy do Vite encaminha ao backend
 *   (vite.config.ts); em produção, o reverse proxy (nginx/traefik).
 * - `withCredentials` — envia o cookie httpOnly `token_access` (o JS
 *   nunca lê o token; quem autentica é o cookie).
 */
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ??
      (status === 0 ? 'Falha de conexão com o servidor' : error.message)

    // 401 em qualquer rota exceto o próprio login = sessão inválida/expirada.
    // Limpa a sessão local e garante o retorno imediato à autenticação.
    if (status === 401 && !error.config?.url?.includes('/auth/login')) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
      window.location.replace('/login')
    }

    return Promise.reject(new ApiError(status, message, error.response?.data))
  },
)
