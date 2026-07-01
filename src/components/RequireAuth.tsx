import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Rota-layout que protege todas as rotas filhas.
 * Sem sessão → redireciona para /login guardando a origem,
 * para o login devolver o usuário à página que ele tentou abrir.
 *
 * Uso:
 *   <Route element={<RequireAuth />}>
 *     <Route path="/" element={<Home />} />
 *   </Route>
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
