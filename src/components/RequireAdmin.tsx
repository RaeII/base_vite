import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { adminMe } from '../api/admin/admin.routes'
import { FORBIDDEN_EVENT } from '../api/client'
import { useAuth } from '../hooks/useAuth'

/**
 * Rota-layout que protege a área admin. Exige SESSÃO ADMIN ELEVADA, não só
 * `is_admin`: confirma em GET /admin/me ao entrar. Sem sessão, sem elevação
 * ou quando ela expira no meio do uso (qualquer 403 → FORBIDDEN_EVENT) →
 * /admin/login guardando a rota de origem.
 *
 * Uso:
 *   <Route element={<RequireAdmin fallback={<PageFallback />} />}>
 *     <Route path="/admin" element={<AdminDashboard />} />
 *   </Route>
 */
export function RequireAdmin({ fallback = null }: { fallback?: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [status, setStatus] = useState<'checking' | 'ok' | 'denied'>('checking')

  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    adminMe().then(
      () => active && setStatus('ok'),
      () => active && setStatus('denied'),
    )
    return () => {
      active = false
    }
  }, [isAuthenticated])

  useEffect(() => {
    const onForbidden = () => setStatus('denied')
    window.addEventListener(FORBIDDEN_EVENT, onForbidden)
    return () => window.removeEventListener(FORBIDDEN_EVENT, onForbidden)
  }, [])

  if (!isAuthenticated || status === 'denied') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }
  if (status === 'checking') return fallback

  return <Outlet />
}
