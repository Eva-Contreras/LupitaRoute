import { useState, type FormEvent } from 'react'
import type { EnvioDetalle, NuevoEnvioRequest } from '../../types/lupita.types'

interface CrearEnvioProps {
  onCrear: (solicitud: NuevoEnvioRequest) => Promise<EnvioDetalle>
}

const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function CrearEnvio({ onCrear }: CrearEnvioProps) {
  const [correoReceptor, setCorreoReceptor] = useState('')
  const [direccionOrigen, setDireccionOrigen] = useState('')
  const [direccionDestino, setDireccionDestino] = useState('')
  const [descripcionPaquete, setDescripcionPaquete] = useState('')
  const [pesoKg, setPesoKg] = useState('')
  const [distanciaKm, setDistanciaKm] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [confirmacion, setConfirmacion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGuardando(true)
    setError(null)
    setConfirmacion(null)

    try {
      const envio = await onCrear({
        correoReceptor: correoReceptor.trim(),
        direccionOrigen: direccionOrigen.trim(),
        direccionDestino: direccionDestino.trim(),
        descripcionPaquete: descripcionPaquete.trim(),
        pesoKg: Number(pesoKg),
        distanciaKm: Number(distanciaKm),
      })
      setConfirmacion(
        `Envío ${envio.codigoRastreo} creado. Costo total: ${formatoMoneda.format(envio.costoTotal)}.`,
      )
      setCorreoReceptor('')
      setDireccionOrigen('')
      setDireccionDestino('')
      setDescripcionPaquete('')
      setPesoKg('')
      setDistanciaKm('')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo crear el envío.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="sender-shipments create-shipment" aria-labelledby="create-shipment-title">
      <header className="sender-section-header">
        <div>
          <h2 id="create-shipment-title">Crear envío</h2>
          <p>Completa la información necesaria para preparar tu paquete.</p>
        </div>
      </header>

      <form className="create-shipment-form" onSubmit={handleSubmit}>
        <section className="create-shipment-section" aria-labelledby="recipient-title">
          <h3 id="recipient-title">Datos del receptor</h3>
          <div className="create-shipment-grid">
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="correo-receptor">Correo del receptor</label>
              <input
                id="correo-receptor"
                name="correoReceptor"
                type="email"
                autoComplete="off"
                placeholder="correo@ejemplo.com"
                required
                value={correoReceptor}
                onChange={(event) => setCorreoReceptor(event.currentTarget.value)}
              />
            </div>
          </div>
        </section>

        <section className="create-shipment-section" aria-labelledby="route-title">
          <h3 id="route-title">Ruta del envío</h3>
          <div className="create-shipment-grid">
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="direccion-origen">Dirección de origen</label>
              <input
                id="direccion-origen"
                name="direccionOrigen"
                type="text"
                autoComplete="street-address"
                placeholder="Calle, número, colonia y referencias"
                required
                value={direccionOrigen}
                onChange={(event) => setDireccionOrigen(event.currentTarget.value)}
              />
            </div>
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="direccion-destino">Dirección de entrega</label>
              <input
                id="direccion-destino"
                name="direccionDestino"
                type="text"
                placeholder="Calle, número, colonia y referencias"
                required
                value={direccionDestino}
                onChange={(event) => setDireccionDestino(event.currentTarget.value)}
              />
            </div>
          </div>
        </section>

        <section className="create-shipment-section" aria-labelledby="package-title">
          <h3 id="package-title">Información del paquete</h3>
          <div className="create-shipment-grid">
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="descripcion-paquete">Descripción del paquete</label>
              <input
                id="descripcion-paquete"
                name="descripcionPaquete"
                type="text"
                placeholder="Ej. Caja con ropa"
                required
                value={descripcionPaquete}
                onChange={(event) => setDescripcionPaquete(event.currentTarget.value)}
              />
            </div>
            <div className="quote-field">
              <label htmlFor="crear-peso">Peso del paquete</label>
              <div className="quote-weight-input">
                <input
                  id="crear-peso"
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
            <div className="quote-field">
              <label htmlFor="crear-distancia">Distancia del envío</label>
              <div className="quote-weight-input">
                <input
                  id="crear-distancia"
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
          </div>
        </section>

        <footer className="create-shipment-footer">
          <p
            className={`quote-demo-note${error ? ' form-message--error' : confirmacion ? ' form-message--success' : ''}`}
            role={error ? 'alert' : 'status'}
          >
            {error ?? confirmacion ?? 'El costo se calcula al crear el envío.'}
          </p>
          <button className="quote-submit" type="submit" disabled={guardando}>
            {guardando ? 'Creando…' : 'Crear envío'}
          </button>
        </footer>
      </form>
    </section>
  )
}
