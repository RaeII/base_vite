import {
  Check,
  LogOut,
  MoreHorizontal,
  Pencil,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserX,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApiError } from '../../api/client'
import { deleteUser, findAllUsers, revokeUserSessions, updateUser } from '../../api/user/user.routes'
import type { User, UserStatus } from '../../api/user/user.types'
import { useApiData } from '../../hooks/useApiData'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime, formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import { LoadError } from '@/components/LoadError'
import { PaginationBar } from '@/components/PaginationBar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserFormSheet } from './components/UserFormSheet'

const PAGE_SIZE = 20

type ConfirmKind = 'deactivate' | 'revoke'

const CONFIRM_COPY: Record<ConfirmKind, { title: string; description: string; action: string }> = {
  deactivate: {
    title: 'Desativar',
    description:
      'A conta deixa de entrar e todas as sessões abertas são encerradas. Os dados ficam preservados e você pode reativá-la depois.',
    action: 'Desativar conta',
  },
  revoke: {
    title: 'Encerrar sessões de',
    description:
      'O usuário é desconectado em todos os dispositivos e precisa entrar de novo. O acesso em uso expira em poucos minutos.',
    action: 'Encerrar sessões',
  },
}

function StatusLabel({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={cn('size-1.5 rounded-full', active ? 'bg-success' : 'bg-muted-foreground/50')} aria-hidden />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

function AdminUsers() {
  const { user: me } = useAuth()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<UserStatus>('active')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  // Sheet/diálogo guardam o alvo ao fechar — a animação de saída não troca o texto.
  const [sheet, setSheet] = useState<{ open: boolean; user: User | null; key: number }>({
    open: false,
    user: null,
    key: 0,
  })
  const [confirm, setConfirm] = useState<{ open: boolean; kind: ConfirmKind; user: User | null }>({
    open: false,
    kind: 'deactivate',
    user: null,
  })

  // Busca com debounce: 300 ms sem digitar → busca na página 1.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const users = useApiData(
    () => findAllUsers({ page, limit: PAGE_SIZE, search: search || undefined, status }),
    [page, search, status],
  )

  const isSelf = (u: User) => String(u.id) === String(me?.id)

  function openSheet(user: User | null) {
    setSheet((s) => ({ open: true, user, key: s.key + 1 }))
  }

  async function run(action: () => Promise<unknown>, success: string) {
    setNotice(null)
    try {
      await action()
      setNotice({ tone: 'ok', text: success })
      users.reload()
    } catch (err) {
      setNotice({ tone: 'error', text: err instanceof ApiError ? err.message : 'Erro inesperado' })
    }
  }

  function confirmAction() {
    const target = confirm.user
    if (!target) return
    if (confirm.kind === 'deactivate') {
      void run(() => deleteUser(target.id), `${target.username} desativado`)
    } else {
      void run(() => revokeUserSessions(target.id), `Sessões de ${target.username} encerradas`)
    }
  }

  const list = users.data
  const copy = CONFIRM_COPY[confirm.kind]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie contas, defina administradores e controle quem tem acesso.
          </p>
        </div>
        <Button onClick={() => openSheet(null)}>
          <UserPlus />
          Novo usuário
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Buscar usuários"
            placeholder="Buscar por username ou e-mail"
            maxLength={100}
            className="h-9 pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Tabs
          value={status}
          onValueChange={(value) => {
            setStatus(value as UserStatus)
            setPage(1)
          }}
        >
          <TabsList aria-label="Filtrar por status">
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {notice && (
        <p
          role={notice.tone === 'error' ? 'alert' : 'status'}
          className={cn(
            'flex items-center gap-2 text-sm',
            notice.tone === 'error' ? 'text-destructive' : 'text-success',
          )}
        >
          {notice.tone === 'ok' && <Check className="size-4" />}
          {notice.text}
        </p>
      )}

      {users.error && !list ? (
        <LoadError message={users.error} onRetry={users.reload} />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table aria-busy={users.loading}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Usuário</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Último acesso</TableHead>
                <TableHead className="hidden lg:table-cell">Criado em</TableHead>
                <TableHead className="w-12 pr-4">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={cn('transition-opacity', users.loading && list && 'opacity-60')}>
              {!list &&
                Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell colSpan={6} className="px-4">
                      <Skeleton className="h-9 bg-muted" />
                    </TableCell>
                  </TableRow>
                ))}

              {list?.data.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    {search ? (
                      <>
                        Nenhum usuário corresponde a “{search}”.{' '}
                        <Button variant="link" className="h-auto p-0" onClick={() => setSearchInput('')}>
                          Limpar busca
                        </Button>
                      </>
                    ) : status === 'inactive' ? (
                      'Nenhuma conta desativada.'
                    ) : (
                      'Nenhum usuário por aqui ainda. Crie o primeiro em “Novo usuário”.'
                    )}
                  </TableCell>
                </TableRow>
              )}

              {list?.data.map((u) => {
                const self = isSelf(u)
                return (
                  <TableRow key={u.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 rounded-lg">
                          <AvatarFallback className="rounded-lg text-xs">
                            {u.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/* max-w: no mobile o e-mail trunca e Papel/Ações cabem sem rolar a tabela. */}
                        <div className="max-w-[9rem] min-w-0 sm:max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className={cn('truncate font-medium', !u.is_active && 'text-muted-foreground')}>
                              {u.username}
                            </span>
                            {self && <Badge variant="outline">Você</Badge>}
                            {!u.is_active && (
                              <Badge variant="outline" className="sm:hidden">
                                Inativo
                              </Badge>
                            )}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">{u.email ?? 'Sem e-mail'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.is_admin ? (
                        <Badge className="bg-accent text-accent-foreground">
                          <ShieldCheck />
                          Admin
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Usuário</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusLabel active={u.is_active} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {u.last_login_at ? (
                        <time dateTime={u.last_login_at} title={formatDateTime(u.last_login_at)}>
                          {formatRelative(u.last_login_at)}
                        </time>
                      ) : (
                        'Nunca entrou'
                      )}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
                      {formatDateTime(u.created_at)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      {/* modal={false}: abrir Sheet/AlertDialog a partir do menu sem travar o foco. */}
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label={`Ações para ${u.username}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onSelect={() => openSheet(u)}>
                            <Pencil />
                            Editar
                          </DropdownMenuItem>
                          {!self && (
                            <>
                              <DropdownMenuItem
                                onSelect={() => setConfirm({ open: true, kind: 'revoke', user: u })}
                              >
                                <LogOut />
                                Encerrar sessões
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {u.is_active ? (
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={() => setConfirm({ open: true, kind: 'deactivate', user: u })}
                                >
                                  <UserX />
                                  Desativar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onSelect={() =>
                                    void run(() => updateUser(u.id, { is_active: true }), `${u.username} reativado`)
                                  }
                                >
                                  <UserCheck />
                                  Reativar
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {list && (
            <div className="border-t px-4 py-3">
              <PaginationBar
                pagination={list.pagination}
                onPageChange={setPage}
                disabled={users.loading}
              />
            </div>
          )}
        </div>
      )}

      <UserFormSheet
        key={sheet.key}
        open={sheet.open}
        onOpenChange={(open) => setSheet((s) => ({ ...s, open }))}
        user={sheet.user}
        isSelf={sheet.user ? isSelf(sheet.user) : false}
        onSaved={(message) => {
          setSheet((s) => ({ ...s, open: false }))
          setNotice({ tone: 'ok', text: message })
          users.reload()
        }}
      />

      <AlertDialog open={confirm.open} onOpenChange={(open) => setConfirm((c) => ({ ...c, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {copy.title} {confirm.user?.username}?
            </AlertDialogTitle>
            <AlertDialogDescription>{copy.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant={confirm.kind === 'deactivate' ? 'destructive' : 'default'}
              onClick={confirmAction}
            >
              {copy.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminUsers
