import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

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

/** Disparado no `window` quando a sessão acabou de verdade (o refresh foi recusado). */
export const SESSION_EXPIRED_EVENT = 'api:session-expired'

/** Disparado no `window` em todo 403 (sem permissão). Na área admin = sessão admin acabou. */
export const FORBIDDEN_EVENT = 'api:forbidden'

/**
 * Cliente axios único da aplicação.
 * - `baseURL: '/api'` — em dev o proxy do Vite encaminha ao backend
 *   (vite.config.ts); em produção, o reverse proxy (nginx/traefik).
 * - `withCredentials` — envia os cookies httpOnly `token_access` (JWT curto)
 *   e `token_refresh` (o JS nunca lê os tokens; quem autentica é o cookie).
 */
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

function toApiError(error: AxiosError<{ message?: string }>) {
  const status = error.response?.status ?? 0
  const message =
    error.response?.data?.message ??
    (status === 0 ? 'Falha de conexão com o servidor' : error.message)
  return new ApiError(status, message, error.response?.data)
}

// 401 nessas rotas é resposta final (credencial errada / sessão morta), não access vencido.
const NO_REFRESH = ['/auth/login', '/auth/admin/login', '/auth/google', '/auth/refresh']

// Renovação em andamento: requests que tomam 401 juntas esperam a mesma,
// em vez de cada uma rotacionar o refresh token.
let refreshing: Promise<unknown> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined

    // 401 = access token ausente/vencido. Renova uma vez com o refresh token e
    // repete a request (seguro: o 401 veio do middleware, a rota não executou).
    if (
      error.response?.status === 401 &&
      config &&
      !config._retried &&
      !NO_REFRESH.some((path) => config.url?.includes(path))
    ) {
      config._retried = true
      refreshing ??= api.post('/auth/refresh').finally(() => {
        refreshing = null
      })
      try {
        await refreshing
      } catch {
        // Refresh recusado = sessão acabou → AuthProvider desloga e o
        // RequireAuth leva ao /login guardando a rota de origem.
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
        return Promise.reject(toApiError(error))
      }
      return api(config)
    }

    // 403 não desloga: quem decide é a tela. O RequireAdmin escuta e volta ao login admin.
    if (error.response?.status === 403) window.dispatchEvent(new Event(FORBIDDEN_EVENT))

    return Promise.reject(toApiError(error))
  },
)
