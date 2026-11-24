import { useState, type FormEvent } from 'react'
import { cotizarEnvio } from '../../services/envios'
import type { CotizarResponse } from '../../types/lupita.types'

const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function CotizarEnvio() {
  const [distanciaKm, setDistanciaKm] = useState('')
  const [pesoKg, setPesoKg] = useState('')
  const [cotizando, setCotizando] = useState(false)
  const [resultado, setResultado] = useState<CotizarResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCotizando(true)
    setError(null)

    try {
      setResultado(
        await cotizarEnvio({
          pesoKg: Number(pesoKg),
          distanciaKm: Number(distanciaKm),
        }),
      )
    } catch (caughtError) {
      setResultado(null)
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo calcular la cotización.',
      )
    } finally {
      setCotizando(false)
    }
  }

  return (
    <section className="sender-shipments quote-page" aria-labelledby="quote-title">
      <header className="sender-section-header">
        <div>
          <h2 id="quote-title">Cotizar envío</h2>
          <p>Indica la distancia y el peso de tu paquete.</p>
        </div>
      </header>

      <div className="quote-content">
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="quote-field">
            <label htmlFor="distancia-km">Distancia del envío</label>
            <div className="quote-weight-input">
              <input
                id="distancia-km"
                name="distanciaKm"
                type="number"
                min="0.1"
                max="5000"
                step="0.1"
                placeholder="Ej. 12.5"
                required
                value={distanciaKm}
                onChange={(event) => setDistanciaKm(event.currentTarget.value)}
              />
              <span>km</span>
            </div>
          </div>
          <div className="quote-field">
            <label htmlFor="peso-paquete">Peso del paquete</label>
            <div className="quote-weight-input">
              <input
                id="peso-paquete"
                name="pesoKg"
                type="number"
                min="0.01"
                max="50"
                step="0.01"
                placeholder="Ej. 2.5"
                required
                value={pesoKg}
                onChange={(event) => setPesoKg(event.currentTarget.value)}
              />
              <span>kg</span>
            </div>
          </div>
          <button className="quote-submit" type="submit" disabled={cotizando}>
            {cotizando ? 'Calculando…' : 'Calcular cotización'}
          </button>
          {error && (
            <p className="quote-demo-note form-message--error" role="alert">
              {error}
            </p>
          )}
        </form>

        <aside className="quote-result" aria-label="Resultado de la cotización">
          <h3>Tu cotización</h3>
          <p>
            {resultado
              ? `Tarifa aplicada: ${resultado.nombreTarifa}.`
              : 'Completa los datos para consultar el precio de tu envío.'}
          </p>
          <dl className="quote-result-details">
            <div>
              <dt>Costo total</dt>
              <dd>{resultado ? formatoMoneda.format(resultado.costoTotal) : '—'}</dd>
            </div>
            <div>
              <dt>Precio base</dt>
              <dd>{resultado ? formatoMoneda.format(resultado.precioBase) : '—'}</dd>
            </div>
            <div>
              <dt>Precio por km</dt>
              <dd>{resultado ? formatoMoneda.format(resultado.precioPorKm) : '—'}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
