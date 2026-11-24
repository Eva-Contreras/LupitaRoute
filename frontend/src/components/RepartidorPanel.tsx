export function RepartidorPanel() {
  return (
    <div className="role-content">
      <section className="dashboard-section">
        <h2>Tu jornada</h2>
        <div className="dashboard-metrics">
          <article className="metric-card">
            <span>Entregas asignadas</span>
            <strong>5</strong>
          </article>
          <article className="metric-card">
            <span>Completadas hoy</span>
            <strong>3</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Próximas entregas</h2>
          <span className="section-caption">Datos de ejemplo</span>
        </div>
        <div className="delivery-list">
          <article className="delivery-card">
            <div>
              <span className="delivery-code">LUP-2026-0142</span>
              <h3>Entrega a Ana García</h3>
              <p>Av. Universidad 1200, Centro</p>
            </div>
            <span className="status-badge">En reparto</span>
          </article>
          <article className="delivery-card">
            <div>
              <span className="delivery-code">LUP-2026-0148</span>
              <h3>Entrega a Javier Torres</h3>
              <p>Calle del Sol 84, Norte</p>
            </div>
            <span className="status-badge status-badge--pending">
              Pendiente
            </span>
          </article>
        </div>
      </section>
    </div>
  )
}
