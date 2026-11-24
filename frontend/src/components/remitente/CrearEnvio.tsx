export function CrearEnvio() {
  return (
    <section className="sender-shipments create-shipment" aria-labelledby="create-shipment-title">
      <header className="sender-section-header">
        <div>
          <h2 id="create-shipment-title">Crear envío</h2>
          <p>Completa la información necesaria para preparar tu paquete.</p>
        </div>
        <span className="section-caption">Formulario de demostración</span>
      </header>

      <form className="create-shipment-form">
        <section className="create-shipment-section" aria-labelledby="recipient-title">
          <h3 id="recipient-title">Datos del destinatario</h3>
          <div className="create-shipment-grid">
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="nombre-destinatario">Nombre del destinatario</label>
              <input
                id="nombre-destinatario"
                name="nombreReceptorExterno"
                type="text"
                autoComplete="name"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="direccion-entrega">Dirección de entrega</label>
              <input
                id="direccion-entrega"
                name="direccionEntrega"
                type="text"
                autoComplete="street-address"
                placeholder="Calle, número, colonia y referencias"
                required
              />
            </div>
          </div>
        </section>

        <section className="create-shipment-section" aria-labelledby="route-title">
          <h3 id="route-title">Ruta del envío</h3>
          <div className="create-shipment-grid">
            <div className="quote-field">
              <label htmlFor="crear-zona-origen">Zona de origen</label>
              <input
                id="crear-zona-origen"
                name="zonaOrigen"
                type="text"
                placeholder="Zona de origen"
                required
              />
            </div>
            <div className="quote-field">
              <label htmlFor="crear-zona-destino">Zona de destino</label>
              <input
                id="crear-zona-destino"
                name="zonaDestino"
                type="text"
                placeholder="Zona de destino"
                required
              />
            </div>
          </div>
        </section>

        <section className="create-shipment-section" aria-labelledby="package-title">
          <h3 id="package-title">Información del paquete</h3>
          <div className="create-shipment-grid">
            <div className="quote-field">
              <label htmlFor="crear-peso">Peso del paquete</label>
              <div className="quote-weight-input">
                <input
                  id="crear-peso"
                  name="pesoKg"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Ej. 2.5"
                  required
                />
                <span>kg</span>
              </div>
            </div>
            <div className="quote-field">
              <label htmlFor="dimensiones-paquete">
                Dimensiones <span className="optional-label">(opcional)</span>
              </label>
              <input
                id="dimensiones-paquete"
                name="dimensiones"
                type="text"
                placeholder="Ej. 30 × 20 × 15 cm"
              />
            </div>
          </div>
        </section>

        <footer className="create-shipment-footer">
          <p className="quote-demo-note">
            Este formulario es visual. El envío no se guardará hasta conectar la
            API.
          </p>
          <button className="quote-submit" type="button" disabled>
            Crear envío
          </button>
        </footer>
      </form>
    </section>
  )
}
