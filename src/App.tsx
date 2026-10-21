import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { RequireAdmin } from './components/RequireAdmin'
import { RequireAuth } from './components/RequireAuth'

// Code-split por página: cada rota vira um chunk próprio (doc/regras/04-performance).
const Login = lazy(() => import('./pages/Login/Login'))
const Signup = lazy(() => import('./pages/Signup/Signup'))
const Home = lazy(() => import('./pages/Home/Home'))
const AdminLayout = lazy(() =>
  import('./components/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/AdminUsers/AdminUsers'))
const AdminAudit = lazy(() => import('./pages/AdminAudit/AdminAudit'))
const AdminSystem = lazy(() => import('./pages/AdminSystem/AdminSystem'))

function PageFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <span className="text-sm text-muted-foreground">Carregando…</span>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider fallback={<PageFallback />}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* key: /login → /admin/login remonta o form (não herda estado). */}
            <Route path="/admin/login" element={<Login key="admin" admin />} />

            {/* Rotas autenticadas: tudo aqui dentro exige sessão */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* Área admin: exige sessão admin elevada (login em /admin/login) */}
            <Route element={<RequireAdmin fallback={<PageFallback />} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/audit" element={<AdminAudit />} />
                <Route path="/admin/system" element={<AdminSystem />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
