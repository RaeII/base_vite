import { useState } from 'react'
import { findAuditLog } from '../../api/admin/admin.routes'
import { useApiData } from '../../hooks/useApiData'
import { formatAuditAction, formatAuditDetail, formatDateTime, formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import { LoadError } from '@/components/LoadError'
import { PaginationBar } from '@/components/PaginationBar'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const PAGE_SIZE = 25

function AdminAudit() {
  const [page, setPage] = useState(1)
  const audit = useApiData(() => findAuditLog({ page, limit: PAGE_SIZE }), [page])
  const list = audit.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Auditoria</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Quem fez o quê na área administrativa: logins de admin, mudanças em usuários e tokens de serviço. O
          registro é gravado junto com a ação e não pode ser editado por aqui.
        </p>
      </div>

      {audit.error && !list ? (
        <LoadError message={audit.error} onRetry={audit.reload} />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table aria-busy={audit.loading}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Quando</TableHead>
                <TableHead>Quem</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead className="hidden md:table-cell">Detalhes</TableHead>
                <TableHead className="hidden pr-4 lg:table-cell">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={cn('transition-opacity', audit.loading && list && 'opacity-60')}>
              {!list &&
                Array.from({ length: 6 }, (_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell colSpan={5} className="px-4">
                      <Skeleton className="h-6 bg-muted" />
                    </TableCell>
                  </TableRow>
                ))}

              {list?.data.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Nenhum evento ainda. Cada login na área admin e cada mudança em usuários vira uma linha aqui.
                  </TableCell>
                </TableRow>
              )}

              {list?.data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="pl-4 whitespace-nowrap">
                    <time dateTime={entry.created_at} title={formatDateTime(entry.created_at)}>
                      {formatRelative(entry.created_at)}
                    </time>
                    <div className="text-xs text-muted-foreground tabular-nums">{formatDateTime(entry.created_at)}</div>
                  </TableCell>
                  <TableCell className="font-medium">{entry.actor_username ?? 'Anônimo'}</TableCell>
                  <TableCell>
                    {formatAuditAction(entry.action)}
                    {entry.target_username && <span className="font-medium"> · {entry.target_username}</span>}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatAuditDetail(entry) ?? '—'}
                  </TableCell>
                  <TableCell className="hidden pr-4 font-mono text-xs text-muted-foreground lg:table-cell">
                    {entry.ip ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {list && (
            <div className="border-t px-4 py-3">
              <PaginationBar
                pagination={list.pagination}
                onPageChange={setPage}
                disabled={audit.loading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminAudit
