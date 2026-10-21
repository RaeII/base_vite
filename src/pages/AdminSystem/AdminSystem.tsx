import { RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { getSystemInfo } from '../../api/admin/admin.routes'
import type { PoolStats } from '../../api/admin/admin.types'
import { useApiData } from '../../hooks/useApiData'
import { formatBytes, formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'
import { HealthIndicator } from '@/components/HealthIndicator'
import { LoadError } from '@/components/LoadError'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function Panel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-xl border bg-card', className)}>
      <h2 className="border-b px-5 py-4 font-semibold tracking-tight">{title}</h2>
      <div className="px-5 py-2">{children}</div>
    </section>
  )
}

function Row({ label, children, tone }: { label: string; children: ReactNode; tone?: 'danger' }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('text-right font-medium tabular-nums', tone === 'danger' && 'text-destructive')}>
        {children}
      </dd>
    </div>
  )
}

function PoolRow({ name, pool }: { name: string; pool?: PoolStats }) {
  return (
    <tr className="border-b last:border-0">
      <th scope="row" className="py-2.5 text-left font-normal text-muted-foreground">
        {name}
      </th>
      <td className="py-2.5 text-right tabular-nums">{pool?.totalCount ?? '—'}</td>
      <td className="py-2.5 text-right tabular-nums">{pool?.idleCount ?? '—'}</td>
      <td className={cn('py-2.5 text-right tabular-nums', pool?.waitingCount && 'font-semibold text-destructive')}>
        {pool?.waitingCount ?? '—'}
      </td>
    </tr>
  )
}

const ms = (value: number) => formatDuration(value / 1000)

function AdminSystem() {
  const system = useApiData(getSystemInfo, [])
  const info = system.data

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sistema</h1>
          <p className="mt-1 text-sm text-muted-foreground">Saúde, runtime, banco e configuração de segurança em vigor.</p>
        </div>
        <Button variant="outline" size="sm" onClick={system.reload} disabled={system.loading}>
          <RotateCw className={cn(system.loading && 'animate-spin')} />
          Atualizar
        </Button>
      </div>

      {system.error && !info ? (
        <LoadError message={system.error} onRetry={system.reload} />
      ) : !info ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className={cn('grid gap-6 transition-opacity md:grid-cols-2', system.loading && 'opacity-60')}>
          <Panel title="Saúde">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <HealthIndicator status={info.health.status} />
              {info.health.detail.ms !== undefined && (
                <span className="text-sm text-muted-foreground tabular-nums">{info.health.detail.ms} ms no banco</span>
              )}
            </div>
            {info.health.status === 'down' ? (
              <p className="py-2.5 text-sm text-destructive">Banco de dados inacessível. Veja os logs do servidor.</p>
            ) : (
              <table className="w-full text-sm">
                <caption className="sr-only">Pools de conexão</caption>
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th scope="col" className="py-2 text-left font-medium">
                      Pool
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Conexões
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Livres
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Na fila
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <PoolRow name="Escrita" pool={info.health.detail.write} />
                  <PoolRow name="Leitura" pool={info.health.detail.read} />
                </tbody>
              </table>
            )}
          </Panel>

          <Panel title="Aplicação">
            <dl className="divide-y">
              <Row label="Ambiente">{info.runtime.environment === 'production' ? 'Produção' : 'Desenvolvimento'}</Row>
              <Row label="Node.js">{info.runtime.node}</Row>
              <Row label="No ar há">{formatDuration(info.runtime.uptimeSeconds)}</Row>
              <Row label="Memória (RSS)">{formatBytes(info.runtime.memory.rssBytes)}</Row>
              <Row label="Heap">
                {formatBytes(info.runtime.memory.heapUsedBytes)} de {formatBytes(info.runtime.memory.heapTotalBytes)}
              </Row>
            </dl>
          </Panel>

          <Panel title="Banco de dados">
            {info.database ? (
              <dl className="divide-y">
                <Row label="PostgreSQL">{info.database.version}</Row>
                <Row label="Tamanho">{formatBytes(info.database.sizeBytes)}</Row>
                <Row label="Conexões abertas">{info.database.connections}</Row>
              </dl>
            ) : (
              <p className="py-2.5 text-sm text-muted-foreground">Indisponível enquanto o banco estiver fora do ar.</p>
            )}
          </Panel>

          <Panel title="Sessões e tokens">
            <dl className="divide-y">
              <Row label="Access token">{formatDuration(info.security.accessTokenTtlSeconds)}</Row>
              <Row label="Sessão de usuário">{formatDuration(info.security.refreshTokenTtlSeconds)} sem uso</Row>
              <Row label="Sessão admin">
                {formatDuration(info.security.adminSessionIdleSeconds)} sem uso · máx.{' '}
                {formatDuration(info.security.adminSessionMaxSeconds)}
              </Row>
              <Row label="Token de serviço">{formatDuration(info.security.serviceTokenTtlSeconds)}</Row>
            </dl>
          </Panel>

          <Panel title="Segurança HTTP" className="md:col-span-2">
            <dl className="grid md:grid-cols-2 md:gap-x-10 [&>div]:border-b md:[&>div:nth-last-child(-n+2)]:border-0 [&>div:last-child]:border-0">
              <Row label="Autorização" tone={info.security.authorization ? undefined : 'danger'}>
                {info.security.authorization ? 'Ativa' : 'Desligada (só em desenvolvimento)'}
              </Row>
              <Row label="Rate limit global">
                {info.security.rateLimit.max} req / {ms(info.security.rateLimit.windowMs)} por IP
              </Row>
              <Row label="Rate limit de login">
                {info.security.rateLimit.loginMax} falhas / {ms(info.security.rateLimit.loginWindowMs)} por IP
              </Row>
              <Row label="Cookie de sessão">
                SameSite={info.security.cookieSameSite} · {info.security.cookieSecure ? 'Secure' : 'sem Secure'}
              </Row>
              <Row label="Origens CORS">
                {info.security.corsOrigins.length ? info.security.corsOrigins.join(', ') : 'Nenhuma (só mesma origem)'}
              </Row>
              <Row label="Proxies confiáveis">{info.security.trustProxy}</Row>
            </dl>
            <p className="border-t py-3 text-xs text-muted-foreground">
              Somente leitura: os valores vêm do <code className="font-mono">.env</code> do servidor e mudam com um novo
              deploy. Segredos (JWT, banco, webhooks) nunca são exibidos.
            </p>
          </Panel>
        </div>
      )}
    </div>
  )
}

export default AdminSystem
