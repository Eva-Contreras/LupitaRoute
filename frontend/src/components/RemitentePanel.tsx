export function RemitentePanel() {
  return (
    <div className="role-content">
      <section className="dashboard-section">
        <h2>Resumen de envíos</h2>
        <div className="dashboard-metrics">
          <article className="metric-card">
            <span>En camino</span>
            <strong>2</strong>
          </article>
          <article className="metric-card">
            <span>Entregados este mes</span>
            <strong>8</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>¿Qué deseas hacer?</h2>
        <div className="dashboard-actions">
          <article className="dashboard-action">
            <span className="action-number">01</span>
            <h3>Cotizar envío</h3>
            <p>Consulta el costo y tiempo estimado de entrega.</p>
          </article>
          <article className="dashboard-action">
            <span className="action-number">02</span>
            <h3>Crear envío</h3>
            <p>Prepara un nuevo paquete para su entrega.</p>
          </article>
          <article className="dashboard-action">
            <span className="action-number">03</span>
            <h3>Mis envíos</h3>
            <p>Revisa el estado de tus paquetes recientes.</p>
          </article>
        </div>
      </section>
    </div>
  )
}
