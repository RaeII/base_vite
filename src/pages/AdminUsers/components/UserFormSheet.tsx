import { useState, type ReactNode, type SyntheticEvent } from 'react'
import { ApiError } from '../../../api/client'
import { createUser, updateUser } from '../../../api/user/user.routes'
import type { UpdateUserInput, User } from '../../../api/user/user.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'

interface UserFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = criar usuário novo. */
  user: User | null
  /** Editando a própria conta: papel e status ficam travados (o backend também recusa). */
  isSelf: boolean
  /** Chamado após salvar, com a mensagem de sucesso. */
  onSaved: (message: string) => void
}

/** Mensagem do backend + issues de validação do Zod (`details.issues`). */
function errorMessages(err: unknown): string[] {
  if (!(err instanceof ApiError)) return ['Erro inesperado ao salvar']
  const issues = (err.details as { issues?: { message: string }[] } | undefined)?.issues
  return issues?.length ? issues.map((i) => i.message) : [err.message]
}

function ToggleRow({
  id,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string
  title: string
  description: ReactNode
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
      <label htmlFor={id} className="grid gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </label>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} className="mt-0.5" />
    </div>
  )
}

/**
 * Criar/editar usuário em painel lateral (a lista continua à vista).
 * Edição envia só os campos alterados; senha em branco = mantém a atual.
 * Remonte com `key` a cada abertura para reiniciar o formulário.
 */
export function UserFormSheet({ open, onOpenChange, user, isSelf, onSaved }: UserFormSheetProps) {
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(user?.is_admin ?? false)
  const [isActive, setIsActive] = useState(user?.is_active ?? true)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setErrors([])
    setSaving(true)
    try {
      const trimmedEmail = email.trim()
      if (!user) {
        await createUser({
          username: username.trim(),
          email: trimmedEmail || undefined,
          password,
          is_admin: isAdmin,
          is_active: isActive,
        })
        onSaved(`Usuário ${username.trim().toLowerCase()} criado`)
        return
      }

      const changes: UpdateUserInput = {}
      if (username.trim() !== user.username) changes.username = username.trim()
      if (trimmedEmail && trimmedEmail !== user.email) changes.email = trimmedEmail
      if (password) changes.password = password
      if (isAdmin !== user.is_admin) changes.is_admin = isAdmin
      if (isActive !== user.is_active) changes.is_active = isActive

      if (Object.keys(changes).length > 0) await updateUser(user.id, changes)
      onSaved(`Alterações em ${user.username} salvas`)
    } catch (err) {
      setErrors(errorMessages(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{user ? `Editar ${user.username}` : 'Novo usuário'}</SheetTitle>
          <SheetDescription>
            {user ? 'Só os campos alterados são enviados.' : 'A conta pode entrar assim que for criada.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <Input
              id="user-username"
              label="Username"
              required
              minLength={3}
              maxLength={45}
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              id="user-email"
              label="E-mail"
              type="email"
              maxLength={45}
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="space-y-1.5">
              <Input
                id="user-password"
                label={user ? 'Nova senha' : 'Senha'}
                type="password"
                required={!user}
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="px-1 text-xs text-muted-foreground">
                {user
                  ? 'Deixe em branco para manter a atual. Trocar a senha encerra as sessões do usuário.'
                  : 'Entre 8 e 72 caracteres.'}
              </p>
            </div>

            <div className="space-y-3">
              <ToggleRow
                id="user-is-admin"
                title="Administrador"
                description={
                  isSelf ? 'Você não pode remover o próprio acesso.' : 'Pode entrar na área administrativa.'
                }
                checked={isAdmin}
                disabled={isSelf}
                onChange={setIsAdmin}
              />
              <ToggleRow
                id="user-is-active"
                title="Conta ativa"
                description={
                  isSelf ? 'Você não pode desativar a própria conta.' : 'Desativar bloqueia o login e encerra as sessões.'
                }
                checked={isActive}
                disabled={isSelf}
                onChange={setIsActive}
              />
            </div>

            {errors.length > 0 && (
              <ul role="alert" className="space-y-1 text-sm text-destructive">
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
          </div>

          <SheetFooter className="flex-row justify-end border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando…' : user ? 'Salvar alterações' : 'Criar usuário'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
