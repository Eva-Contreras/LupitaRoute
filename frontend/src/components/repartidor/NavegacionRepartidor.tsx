export type SeccionRepartidor = 'entregas' | 'actualizar'

interface NavegacionRepartidorProps {
  seccionActiva: SeccionRepartidor
  onCambiarSeccion: (seccion: SeccionRepartidor) => void
}

const OPCIONES: { id: SeccionRepartidor; etiqueta: string }[] = [
  { id: 'entregas', etiqueta: 'Mis entregas' },
  { id: 'actualizar', etiqueta: 'Actualizar estado' },
]

export function NavegacionRepartidor({
  seccionActiva,
  onCambiarSeccion,
}: NavegacionRepartidorProps) {
  return (
    <aside className="sender-sidebar" aria-label="Navegación de repartidor">
      <h2>Reparto</h2>
      <nav className="sender-nav">
        {OPCIONES.map((opcion) => (
          <button
            key={opcion.id}
            className={`sender-nav-item${seccionActiva === opcion.id ? ' sender-nav-item--active' : ''}`}
            type="button"
            aria-current={seccionActiva === opcion.id ? 'page' : undefined}
            onClick={() => onCambiarSeccion(opcion.id)}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </nav>
    </aside>
  )
}
