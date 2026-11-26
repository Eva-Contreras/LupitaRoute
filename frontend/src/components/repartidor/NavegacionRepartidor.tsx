export type SeccionRepartidor = 'entregas' | 'disponibles' | 'actualizar'

interface NavegacionRepartidorProps {
  seccionActiva: SeccionRepartidor
  onCambiarSeccion: (seccion: 'entregas' | 'disponibles') => void
  deshabilitada?: boolean
}

export function NavegacionRepartidor({
  seccionActiva,
  onCambiarSeccion,
  deshabilitada = false,
}: NavegacionRepartidorProps) {
  return (
    <aside className="sender-sidebar" aria-label="Navegación de repartidor">
      <h2>Entregas</h2>
      <nav className="sender-nav courier-nav">
        <button
          className={`sender-nav-item${seccionActiva !== 'disponibles' ? ' sender-nav-item--active' : ''}`}
          type="button"
          disabled={deshabilitada}
          onClick={() => onCambiarSeccion('entregas')}
        >
          Mis entregas
        </button>
        <button
          className={`sender-nav-item${seccionActiva === 'disponibles' ? ' sender-nav-item--active' : ''}`}
          type="button"
          disabled={deshabilitada}
          onClick={() => onCambiarSeccion('disponibles')}
        >
          Envíos disponibles
        </button>
      </nav>
    </aside>
  )
}
