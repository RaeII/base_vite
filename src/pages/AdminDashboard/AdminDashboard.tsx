import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { findAuditLog, getAdminStats, getSystemInfo } from '../../api/admin/admin.routes'
import { useApiData } from '../../hooks/useApiData'
import { formatAuditAction, formatAuditDetail, formatDateTime, formatRelative } from '@/lib/format'
import { HealthIndicator } from '@/components/HealthIndicator'
import { LoadError } from '@/components/LoadError'
import { Skeleton } from '@/components/ui/skeleton'

const RECENT_LIMIT = 8

function Stat({ label, value, hint }: { label: string; value?: number; hint?: ReactNode }) {
  return (
    <div className="bg-card px-4 py-4">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {value === undefined ? <Skeleton className="h-8 w-12 bg-muted" /> : value.toLocaleString('pt-BR')}
      </dd>
      {hint && <dd className="mt-0.5 text-xs text-muted-foreground">{hint}</dd>}
    </div>
  )
}

function SectionHeader({ title, to, linkLabel }: { title: string; to: string; linkLabel: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b px-5 py-4">
      <h2 className="font-semibold tracking-tight">{title}</h2>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {linkLabel}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}

function AdminDashboard() {
  const stats = useApiData(getAdminStats, [])
  const system = useApiData(getSystemInfo, [])
  const recent = useApiData(() => findAuditLog({ limit: RECENT_LIMIT }), [])
  const s = stats.data
  const health = system.data?.health

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Visão geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">Usuários, sessões e saúde do sistema agora.</p>
      </div>

      {stats.error ? (
        <LoadError message={stats.error} onRetry={stats.reload} />
      ) : (
        // gap-px sobre bg-border: divisórias de 1px entre as células, sem cards soltos.
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Usuários ativos" value={s?.activeUsers} hint={s && `de ${s.totalUsers} cadastrados`} />
          <Stat label="Inativos" value={s?.inactiveUsers} />
          <Stat label="Administradores" value={s?.admins} />
          <Stat label="Novos (7 dias)" value={s?.newUsersLast7Days} />
          <Stat label="Logins (24 h)" value={s?.loginsLast24h} />
          <Stat
            label="Sessões ativas"
            value={s?.activeSessions}
            hint={s && `${s.adminSessions} em modo admin`}
          />
        </dl>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <section className="rounded-xl border bg-card lg:col-span-3">
          <SectionHeader title="Atividade recente" to="/admin/audit" linkLabel="Ver auditoria" />
          {recent.error ? (
            <LoadError message={recent.error} onRetry={recent.reload} className="m-5" />
          ) : !recent.data ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-9 bg-muted" />
              ))}
            </div>
          ) : recent.data.data.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">
              Nenhuma ação administrativa registrada ainda. Criações, alterações de usuários e logins na área
              admin aparecem aqui.
            </p>
          ) : (
            <ul className="divide-y">
              {recent.data.data.map((entry) => {
                const detail = formatAuditDetail(entry)
                return (
                  <li key={entry.id} className="flex items-start justify-between gap-4 px-5 py-3">
                    <div className="min-w-0 text-sm">
                      <p className="truncate">
                        <span className="font-medium">{entry.actor_username ?? 'Anônimo'}</span>{' '}
                        <span className="text-muted-foreground">{formatAuditAction(entry.action).toLowerCase()}</span>
                        {entry.target_username && <span className="font-medium"> {entry.target_username}</span>}
                      </p>
                      {detail && <p className="truncate text-xs text-muted-foreground">{detail}</p>}
                    </div>
                    <time
                      dateTime={entry.created_at}
                      title={formatDateTime(entry.created_at)}
                      className="shrink-0 text-xs text-muted-foreground tabular-nums"
                    >
                      {formatRelative(entry.created_at)}
                    </time>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border bg-card lg:col-span-2">
          <SectionHeader title="Saúde do sistema" to="/admin/system" linkLabel="Detalhes" />
          {system.error ? (
            <LoadError message={system.error} onRetry={system.reload} className="m-5" />
          ) : !health ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-32 bg-muted" />
              <Skeleton className="h-16 bg-muted" />
            </div>
          ) : (
            <div className="space-y-4 p-5">
              <HealthIndicator status={health.status} />
              <dl className="divide-y text-sm">
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-muted-foreground">Latência do banco</dt>
                  <dd className="tabular-nums">{health.detail.ms !== undefined ? `${health.detail.ms} ms` : '—'}</dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-muted-foreground">Conexões (escrita)</dt>
                  <dd className="tabular-nums">
                    {health.detail.write
                      ? `${health.detail.write.totalCount - health.detail.write.idleCount} em uso · ${health.detail.write.idleCount} livres`
                      : '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-muted-foreground">Requisições na fila</dt>
                  <dd className="tabular-nums">
                    {health.detail.write && health.detail.read
                      ? health.detail.write.waitingCount + health.detail.read.waitingCount
                      : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
