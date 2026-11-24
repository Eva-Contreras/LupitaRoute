export type SeccionRepartidor = 'entregas' | 'actualizar'

interface NavegacionRepartidorProps {
  seccionActiva: SeccionRepartidor
  onCambiarSeccion: (seccion: SeccionRepartidor) => void
}

export function NavegacionRepartidor({
  seccionActiva,
  onCambiarSeccion,
}: NavegacionRepartidorProps) {
  return (
    <aside className="sender-sidebar" aria-label="Navegación de repartidor">
      <h2>Entregas</h2>
      <nav className="sender-nav">
        <button
          className={`sender-nav-item${seccionActiva === 'entregas' ? ' sender-nav-item--active' : ''}`}
          type="button"
          onClick={() => onCambiarSeccion('entregas')}
        >
          Mis entregas
        </button>
        <button
          className={`sender-nav-item${seccionActiva === 'actualizar' ? ' sender-nav-item--active' : ''}`}
          type="button"
          onClick={() => onCambiarSeccion('actualizar')}
        >
          Actualizar estado
        </button>
      </nav>
    </aside>
  )
}
