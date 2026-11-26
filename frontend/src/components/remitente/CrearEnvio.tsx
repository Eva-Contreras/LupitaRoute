import { useState, type FormEvent } from 'react'
import { verificarReceptor } from '../../services/envios'
import type { EnvioDetalle, NuevoEnvioRequest } from '../../types/envio.types'

interface CrearEnvioProps {
  token: string
  onCrear: (solicitud: NuevoEnvioRequest) => Promise<EnvioDetalle>
}

const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function CrearEnvio({ token, onCrear }: CrearEnvioProps) {
  const [correoReceptor, setCorreoReceptor] = useState('')
  const [receptorVerificado, setReceptorVerificado] = useState<{ correo: string; nombre: string } | null>(null)
  const [verificandoReceptor, setVerificandoReceptor] = useState(false)
  const [errorVerificacion, setErrorVerificacion] = useState<string | null>(null)
  const [direccionOrigen, setDireccionOrigen] = useState('')
  const [direccionDestino, setDireccionDestino] = useState('')
  const [descripcionPaquete, setDescripcionPaquete] = useState('')
  const [pesoKg, setPesoKg] = useState('')
  const [distanciaKm, setDistanciaKm] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [confirmacion, setConfirmacion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function verificarCorreo() {
    const correo = correoReceptor.trim().toLowerCase()
    if (!correo) {
      setErrorVerificacion('Escribe el correo del receptor para verificarlo.')
      return
    }

    setVerificandoReceptor(true)
    setErrorVerificacion(null)
    setReceptorVerificado(null)
    try {
      const receptor = await verificarReceptor(token, correo)
      setReceptorVerificado({
        correo: receptor.correo.toLowerCase(),
        nombre: receptor.nombreCompleto,
      })
    } catch (caughtError) {
      setErrorVerificacion(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo verificar el correo del receptor.',
      )
    } finally {
      setVerificandoReceptor(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGuardando(true)
    setError(null)
    setConfirmacion(null)

    try {
      if (receptorVerificado?.correo !== correoReceptor.trim().toLowerCase()) {
        throw new Error('Verifica el correo del receptor antes de crear el envío.')
      }
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
      setReceptorVerificado(null)
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
                onChange={(event) => {
                  setCorreoReceptor(event.currentTarget.value)
                  setReceptorVerificado(null)
                  setErrorVerificacion(null)
                }}
              />
            </div>
            <button
              className="shipment-action"
              type="button"
              disabled={verificandoReceptor || guardando}
              onClick={verificarCorreo}
            >
              {verificandoReceptor ? 'Verificando…' : 'Verificar receptor'}
            </button>
            {receptorVerificado && (
              <p className="quote-demo-note" role="status">
                Receptor verificado: {receptorVerificado.nombre} ({receptorVerificado.correo}).
              </p>
            )}
            {errorVerificacion && (
              <p className="quote-demo-note form-message--error" role="alert">
                {errorVerificacion}
              </p>
            )}
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
