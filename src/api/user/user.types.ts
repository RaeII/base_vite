/** Usuário público retornado pela API (sem hash de senha). */
export interface User {
  id: number
  username: string
  email: string | null
  is_active: boolean
  is_admin: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string | null
}

export interface CreateUserInput {
  username: string
  password: string
  email?: string
  is_active?: boolean
  is_admin?: boolean
}

export type UpdateUserInput = Partial<CreateUserInput>

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface Paginated<T> {
  data: T[]
  pagination: PaginationMeta
}
