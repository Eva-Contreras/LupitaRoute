export function ReceptorPanel() {
  return (
    <div className="role-content">
      <section className="dashboard-section tracking-card">
        <h2>Rastrea tu paquete</h2>
        <p>Ingresa el código de rastreo que te compartieron.</p>
        <form className="tracking-form">
          <label className="visually-hidden" htmlFor="codigo-rastreo">
            Código de rastreo
          </label>
          <input
            id="codigo-rastreo"
            name="codigo-rastreo"
            type="text"
            placeholder="Ej. LUP-2026-0001"
          />
          <button type="button">Consultar</button>
        </form>
        <p className="tracking-demo-note">
          Ejemplo visual: la consulta todavía no está conectada.
        </p>
      </section>

      <section className="dashboard-section">
        <h2>Envío reciente</h2>
        <article className="tracking-result">
          <div>
            <span className="delivery-code">LUP-2026-0142</span>
            <h3>Tu paquete está en camino</h3>
            <p>Última actualización: hoy, 10:30 a. m.</p>
          </div>
          <span className="status-badge">En tránsito</span>
        </article>
      </section>
    </div>
  )
}
