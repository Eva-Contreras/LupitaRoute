export function CotizarEnvio() {
  return (
    <section className="sender-shipments quote-page" aria-labelledby="quote-title">
      <header className="sender-section-header">
        <div>
          <h2 id="quote-title">Cotizar envío</h2>
          <p>Indica el origen, destino y peso de tu paquete.</p>
        </div>
        <span className="section-caption">Cotización de demostración</span>
      </header>

      <div className="quote-content">
        <form className="quote-form">
          <div className="quote-field">
            <label htmlFor="zona-origen">Zona de origen</label>
            <input
              id="zona-origen"
              name="zonaOrigen"
              type="text"
              placeholder="Escribe la zona de origen"
              autoComplete="address-level2"
            />
          </div>
          <div className="quote-field">
            <label htmlFor="zona-destino">Zona de destino</label>
            <input
              id="zona-destino"
              name="zonaDestino"
              type="text"
              placeholder="Escribe la zona de destino"
              autoComplete="address-level2"
            />
          </div>
          <div className="quote-field">
            <label htmlFor="peso-paquete">Peso del paquete</label>
            <div className="quote-weight-input">
              <input
                id="peso-paquete"
                name="pesoKg"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej. 2.5"
              />
              <span>kg</span>
            </div>
          </div>
          <button className="quote-submit" type="button" disabled>
            Calcular cotización
          </button>
          <p className="quote-demo-note">
            El cálculo estará disponible cuando conectemos la API.
          </p>
        </form>

        <aside className="quote-result" aria-label="Resultado de la cotización">
          <h3>Tu cotización</h3>
          <p>
            Completa los datos para consultar el precio y el tiempo estimado de
            entrega.
          </p>
          <dl className="quote-result-details">
            <div>
              <dt>Costo total</dt>
              <dd>—</dd>
            </div>
            <div>
              <dt>Entrega estimada</dt>
              <dd>— días</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
