import { useEffect, useRef } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Client ID público do Google OAuth (mesmo GOOGLE_CLIENT_ID do backend). Vazio = sem botão.
const GOOGLE_CLIENT_ID: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Tipos mínimos do Google Identity Services — só o que este componente usa.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string
            callback: (response: { credential: string }) => void
            use_fedcm_for_button?: boolean
          }): void
          renderButton(parent: HTMLElement, options: Record<string, unknown>): void
        }
      }
    }
  }
}

// Script GIS sob demanda (~100 KiB): só baixa quando uma tela com o botão monta.
let loading: Promise<void> | null = null

function loadGoogleIdentity(): Promise<void> {
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      // Falhou (rede, bloqueador): a próxima montagem tenta de novo.
      script.remove()
      loading = null
      reject(new Error('Google Identity Services indisponível'))
    }
    document.head.appendChild(script)
  })
  return loading
}

// GIS avisa se `initialize` roda de novo: inicializa uma vez por página. O callback
// chama o botão montado no momento (cada tela monta o seu).
let initialized = false
let handleCredential: (credential: string) => void = () => {}

/** Logo "G" do Google (4 cores, sem fundo). */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

interface GoogleLoginButtonProps {
  /** Recebe o ID token (`credential`) do Google — repasse a `useAuth().loginWithGoogle`. */
  onCredential: (credential: string) => void
  disabled?: boolean
}

/**
 * "Continuar com Google" + divisor "ou". Botão custom visível com o botão real do
 * GIS invisível por cima (é ele que recebe o clique). Sem VITE_GOOGLE_CLIENT_ID
 * não renderiza nada; sem o script (rede/bloqueador) o login por senha segue.
 */
export function GoogleLoginButton({ onCredential, disabled = false }: GoogleLoginButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Mantém o handler atual: o GIS chama fora do ciclo do React, sem reinicializar.
  useEffect(() => {
    handleCredential = onCredential
  })

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let cancelled = false

    loadGoogleIdentity().then(() => {
      const id = window.google?.accounts.id
      const el = ref.current
      if (cancelled || !id || !el) return
      if (!initialized) {
        id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => handleCredential(response.credential),
          // Diálogo nativo do navegador (FedCM) em vez do popup; sem FedCM cai no popup.
          use_fedcm_for_button: true,
        })
        initialized = true
      }
      // `width` casa com o wrapper para o iframe invisível cobrir o clique inteiro.
      id.renderButton(el, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: Math.min(400, Math.round(el.offsetWidth) || 320),
        locale: 'pt-BR',
      })
    }, () => {})

    return () => {
      cancelled = true
    }
  }, [])

  if (!GOOGLE_CLIENT_ID) return null

  return (
    <div className="space-y-5">
      <div
        className={cn(
          'group relative h-10 rounded-md focus-within:ring-[3px] focus-within:ring-ring/50',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <span
          aria-hidden
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'pointer-events-none absolute inset-0 h-full w-full gap-3 group-hover:bg-accent',
          )}
        >
          <GoogleG className="size-5" />
          Continuar com Google
        </span>
        <div ref={ref} className="absolute inset-0 opacity-0" />
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  )
}
