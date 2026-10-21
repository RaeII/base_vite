import { useEffect, useState, type DependencyList } from 'react'
import { ApiError } from '../api/client'

export interface ApiData<T> {
  /** Último resultado bom — mantido durante o recarregamento (sem piscar). */
  data: T | undefined
  /** Mensagem do último erro, ou null. */
  error: string | null
  loading: boolean
  /** Busca de novo com os mesmos `deps`. */
  reload: () => void
}

/**
 * Busca dados da API ao montar e sempre que `deps` mudar.
 * Resposta atrasada de uma busca antiga é descartada.
 *
 * `deps` devem ser primitivos (page, search, status…) — viram uma chave.
 * Ponytail: sem cache entre páginas; se 2+ telas precisarem do mesmo dado
 * em cache, é a hora do React Query (doc/regras/04-performance §3).
 */
export function useApiData<T>(load: () => Promise<T>, deps: DependencyList): ApiData<T> {
  const [version, setVersion] = useState(0)
  const key = JSON.stringify([...deps, version])
  const [result, setResult] = useState<{ key: string; data?: T; error: string | null }>({
    key: '',
    error: null,
  })

  useEffect(() => {
    let active = true
    load().then(
      (data) => {
        if (active) setResult({ key, data, error: null })
      },
      (err: unknown) => {
        if (!active) return
        const error = err instanceof ApiError ? err.message : 'Erro inesperado'
        setResult((prev) => ({ key, data: prev.data, error }))
      },
    )
    return () => {
      active = false
    }
    // `load` é recriada a cada render; quem decide a nova busca é `key` (deps + reload).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return {
    data: result.data,
    error: result.error,
    loading: result.key !== key,
    reload: () => setVersion((v) => v + 1),
  }
}
