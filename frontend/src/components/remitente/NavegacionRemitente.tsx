export function NavegacionRemitente() {
  return (
    <aside className="sender-sidebar" aria-label="Navegación de remitente">
      <h2>Envíos</h2>
      <nav className="sender-nav">
        <button
          className="sender-nav-item sender-nav-item--active"
          type="button"
          aria-current="page"
        >
          Mis envíos
        </button>
        <button
          className="sender-nav-item"
          type="button"
          disabled
          title="Disponible próximamente"
        >
          Cotizar envío
          <span>Próximamente</span>
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
