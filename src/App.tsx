import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { RequireAuth } from './components/RequireAuth'

// Code-split por página: cada rota vira um chunk próprio (doc/regras/04-performance).
const Login = lazy(() => import('./pages/Login/Login'))
const Signup = lazy(() => import('./pages/Signup/Signup'))
const Home = lazy(() => import('./pages/Home/Home'))

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
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Rotas autenticadas: tudo aqui dentro exige sessão */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
