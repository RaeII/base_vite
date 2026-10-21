import type { HealthStatus } from '../api/admin/admin.types'
import { cn } from '@/lib/utils'

const STATUS: Record<HealthStatus, { label: string; dot: string; text: string }> = {
  ok: { label: 'Operacional', dot: 'bg-success', text: 'text-success' },
  degraded: { label: 'Degradado', dot: 'bg-accent', text: 'text-foreground' },
  down: { label: 'Fora do ar', dot: 'bg-destructive', text: 'text-destructive' },
}

/** Status do health check (`ok` · `degraded` · `down`) como ponto colorido + rótulo. */
export function HealthIndicator({ status, className }: { status: HealthStatus; className?: string }) {
  const s = STATUS[status]
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', s.text, className)}>
      <span className={cn('size-2 rounded-full', s.dot)} aria-hidden />
      {s.label}
    </span>
  )
}
