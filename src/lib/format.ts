import type { AuditEntry } from '../api/admin/admin.types'

// Formatação pt-BR para telas de dados (datas, tamanhos, durações, auditoria).

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const relative = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

/** "21/10/2026, 15:58" */
export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso))
}

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 30],
  ['month', 12],
  ['year', Infinity],
]

/** "agora", "há 5 minutos", "há 3 dias" */
export function formatRelative(iso: string, now = Date.now()): string {
  let value = (new Date(iso).getTime() - now) / 1000
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(value) < size) return relative.format(Math.round(value), unit)
    value /= size
  }
  return formatDateTime(iso)
}

/** "8,3 MB" */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: i === 0 ? 0 : 1 })} ${units[i]}`
}

/** "15 min", "8 h", "7 dias", "2 h 5 min" — maior unidade + a seguinte, se houver. */
export function formatDuration(seconds: number): string {
  const parts: string[] = []
  const days = Math.floor(seconds / 86_400)
  const hours = Math.floor((seconds % 86_400) / 3_600)
  const minutes = Math.floor((seconds % 3_600) / 60)
  if (days) parts.push(days === 1 ? '1 dia' : `${days} dias`)
  if (hours) parts.push(`${hours} h`)
  if (minutes) parts.push(`${minutes} min`)
  if (!parts.length) return `${Math.round(seconds)} s`
  return parts.slice(0, 2).join(' ')
}

const AUDIT_ACTIONS: Record<AuditEntry['action'], string> = {
  'admin.login': 'Entrou na área admin',
  'user.create': 'Criou usuário',
  'user.update': 'Alterou usuário',
  'user.deactivate': 'Desativou usuário',
  'user.revoke_sessions': 'Encerrou sessões',
  'service_token.create': 'Gerou token de serviço',
}

const USER_FIELDS: Record<string, string> = {
  username: 'username',
  email: 'e-mail',
  password: 'senha',
  is_active: 'status',
  is_admin: 'papel',
}

/** Rótulo da ação; ação desconhecida (backend mais novo) cai no código cru. */
export function formatAuditAction(action: string): string {
  return AUDIT_ACTIONS[action as AuditEntry['action']] ?? action
}

/** Complemento legível do `detail` ("campos: senha, papel"), ou null. */
export function formatAuditDetail(entry: AuditEntry): string | null {
  const detail = entry.detail
  if (!detail) return null
  if (Array.isArray(detail.fields)) {
    return `campos: ${detail.fields.map((f) => USER_FIELDS[String(f)] ?? String(f)).join(', ')}`
  }
  if (entry.action === 'user.create') return detail.is_admin ? 'como administrador' : null
  if (typeof detail.name === 'string') return detail.name
  return null
}
