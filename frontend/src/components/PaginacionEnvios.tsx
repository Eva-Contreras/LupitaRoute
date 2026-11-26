interface PaginacionEnviosProps {
  pagina: number
  totalPaginas: number
  totalRegistros: number
  deshabilitada: boolean
  onCambiar: (pagina: number) => void
}

export function PaginacionEnvios({
  pagina,
  totalPaginas,
  totalRegistros,
  deshabilitada,
  onCambiar,
}: PaginacionEnviosProps) {
  if (totalRegistros === 0) {
    return null
  }

  return (
    <nav className="shipment-pagination" aria-label="Paginación">
      <span role="status">
        Página {pagina} de {Math.max(totalPaginas, 1)} · {totalRegistros} en total
      </span>
      <div className="shipment-pagination__actions">
        <button
          className="shipment-action"
          type="button"
          disabled={deshabilitada || pagina <= 1}
          onClick={() => onCambiar(pagina - 1)}
        >
          Anterior
        </button>
        <button
          className="shipment-action"
          type="button"
          disabled={deshabilitada || pagina >= totalPaginas}
          onClick={() => onCambiar(pagina + 1)}
        >
          Siguiente
        </button>
      </div>
    </nav>
  )
}
