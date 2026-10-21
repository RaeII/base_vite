import { RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Falha ao carregar dados: mensagem + "Tentar de novo". Par natural do `useApiData` (`error`/`reload`). */
export function LoadError({ message, onRetry, className }: { message: string; onRetry: () => void; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm',
        className,
      )}
    >
      <span className="text-destructive">Não foi possível carregar: {message}</span>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCw />
        Tentar de novo
      </Button>
    </div>
  )
}
