import { api } from '../client'
import type { CreateUserInput, ListUsersParams, Paginated, UpdateUserInput, User } from './user.types'

// Rotas /user do backend — todas exigem sessão admin elevada (403 sem ela).

export async function findAllUsers(params?: ListUsersParams) {
  const { data } = await api.get<Paginated<User>>('/user', { params })
  return data
}

export async function findUserById(id: number) {
  const { data } = await api.get<{ data: User }>(`/user/${id}`)
  return data.data
}

export async function createUser(input: CreateUserInput) {
  const { data } = await api.post<{ data: User }>('/user', input)
  return data.data
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const { data } = await api.put<{ data: User }>(`/user/${id}`, input)
  return data.data
}

/** Soft delete — o backend desativa o usuário e encerra as sessões dele. */
export async function deleteUser(id: number) {
  const { data } = await api.delete<{ message: string }>(`/user/${id}`)
  return data
}

/** Encerra todas as sessões do usuário — força novo login. */
export async function revokeUserSessions(id: number) {
  const { data } = await api.post<{ message: string }>(`/user/${id}/revoke-sessions`)
  return data
}
