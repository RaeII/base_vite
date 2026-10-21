import { api } from '../client'
import type { Paginated, User } from '../user/user.types'
import type { AdminStats, AuditEntry, SystemInfo } from './admin.types'

// Rotas /admin do backend — exigem sessão admin elevada (login em /auth/admin/login).
// Sem ela: 403 → o interceptor dispara FORBIDDEN_EVENT e o RequireAdmin volta ao login admin.

/** Admin da sessão elevada. 403 = sem sessão admin. */
export async function adminMe() {
  const { data } = await api.get<{ data: User }>('/admin/me')
  return data.data
}

export async function getAdminStats() {
  const { data } = await api.get<{ data: AdminStats }>('/admin/stats')
  return data.data
}

export async function getSystemInfo() {
  const { data } = await api.get<{ data: SystemInfo }>('/admin/system')
  return data.data
}

/** Trilha de auditoria, mais recentes primeiro. */
export async function findAuditLog(params?: { page?: number; limit?: number }) {
  const { data } = await api.get<Paginated<AuditEntry>>('/admin/audit', { params })
  return data
}
