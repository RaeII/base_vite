import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationMeta } from '../api/user/user.types'
import { Button } from '@/components/ui/button'

interface PaginationBarProps {
  /** `pagination` da resposta paginada do backend. */
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  disabled?: boolean
}

/** Rodapé de lista paginada: "1–20 de 57" + Anterior/Próxima. */
export function PaginationBar({ pagination, onPageChange, disabled }: PaginationBarProps) {
  const { page, limit, total, totalPages, hasPrev, hasNext } = pagination
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span className="tabular-nums">
        {total === 0 ? 'Nenhum resultado' : `${from === to ? from : `${from}–${to}`} de ${total}`}
      </span>
      <div className="flex items-center gap-2">
        <span className="hidden tabular-nums sm:inline">
          Página {page} de {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || !hasPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || !hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
