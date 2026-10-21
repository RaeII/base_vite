export interface AdminStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  admins: number
  newUsersLast7Days: number
  loginsLast24h: number
  activeSessions: number
  /** Sessões com elevação admin válida agora. */
  adminSessions: number
}

export interface PoolStats {
  totalCount: number
  idleCount: number
  waitingCount: number
}

export type HealthStatus = 'ok' | 'degraded' | 'down'

export interface SystemInfo {
  health: {
    status: HealthStatus
    detail: { ms?: number; write?: PoolStats; read?: PoolStats; error?: string }
  }
  runtime: {
    environment: 'production' | 'development'
    node: string
    uptimeSeconds: number
    memory: { rssBytes: number; heapUsedBytes: number; heapTotalBytes: number }
  }
  /** null quando o banco está fora do ar. */
  database: { version: string; sizeBytes: number; connections: number } | null
  /** Configuração efetiva e não sensível do servidor (vem do .env, só leitura). */
  security: {
    authorization: boolean
    accessTokenTtlSeconds: number
    refreshTokenTtlSeconds: number
    serviceTokenTtlSeconds: number
    adminSessionIdleSeconds: number
    adminSessionMaxSeconds: number
    rateLimit: { windowMs: number; max: number; loginWindowMs: number; loginMax: number }
    corsOrigins: string[]
    cookieSameSite: 'lax' | 'strict' | 'none'
    cookieSecure: boolean
    trustProxy: number
  }
}

export type AuditAction =
  | 'admin.login'
  | 'user.create'
  | 'user.update'
  | 'user.deactivate'
  | 'user.revoke_sessions'
  | 'service_token.create'

export interface AuditEntry {
  id: number
  action: AuditAction
  actor_id: number | null
  actor_username: string | null
  target_user_id: number | null
  target_username: string | null
  /** Contexto: `fields` (user.update), `is_admin` (user.create), `name` (service_token.create). */
  detail: Record<string, unknown> | null
  ip: string | null
  created_at: string
}
