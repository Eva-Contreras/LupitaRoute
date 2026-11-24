export type SeccionRemitente = 'envios' | 'cotizar'

interface NavegacionRemitenteProps {
  seccionActiva: SeccionRemitente
  onCambiarSeccion: (seccion: SeccionRemitente) => void
}

export function NavegacionRemitente({
  seccionActiva,
  onCambiarSeccion,
}: NavegacionRemitenteProps) {
  return (
    <aside className="sender-sidebar" aria-label="Navegación de remitente">
      <h2>Envíos</h2>
      <nav className="sender-nav">
        <button
          className={`sender-nav-item${seccionActiva === 'envios' ? ' sender-nav-item--active' : ''}`}
          type="button"
          aria-current={seccionActiva === 'envios' ? 'page' : undefined}
          onClick={() => onCambiarSeccion('envios')}
        >
          Mis envíos
        </button>
        <button
          className={`sender-nav-item${seccionActiva === 'cotizar' ? ' sender-nav-item--active' : ''}`}
          type="button"
          aria-current={seccionActiva === 'cotizar' ? 'page' : undefined}
          onClick={() => onCambiarSeccion('cotizar')}
        >
          Cotizar envío
        </button>
        <button
          className="sender-nav-item"
          type="button"
          disabled
          title="Disponible próximamente"
        >
          Crear envío
          <span>Próximamente</span>
        </button>
      </nav>
    </aside>
  )
}
