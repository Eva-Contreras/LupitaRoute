import { useState, type FormEvent } from 'react'
import type { EnvioDetalle, EstadoPaquete } from '../../types/envio.types'

interface ActualizarEstadoProps {
  entregas: EnvioDetalle[]
  estados: EstadoPaquete[]
  envioIdInicial: number | null
  onGuardar: (
    envioId: number,
    estadoId: number,
    comentario: string,
  ) => Promise<void>
}

export function ActualizarEstado({
  entregas,
  estados,
  envioIdInicial,
  onGuardar,
}: ActualizarEstadoProps) {
  const estadosDisponibles = estados.filter(
    (estado) => estado.nombre.trim().toLocaleLowerCase('es-MX') !== 'cancelado',
  )
  const [envioId, setEnvioId] = useState(
    envioIdInicial === null ? '' : String(envioIdInicial),
  )
  const [nuevoEstadoId, setNuevoEstadoId] = useState('')
  const [comentario, setComentario] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [confirmacion, setConfirmacion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const entregaActual = entregas.find(
    (entrega) => String(entrega.envioId) === envioId,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!entregaActual || nuevoEstadoId === '') {
      return
    }

    setGuardando(true)
    setError(null)
    setConfirmacion(null)

    try {
      await onGuardar(
        entregaActual.envioId,
        Number(nuevoEstadoId),
        comentario.trim(),
      )
      const nombre =
        estados.find((estado) => String(estado.estadoId) === nuevoEstadoId)
          ?.nombre ?? ''
      setConfirmacion(
        `${entregaActual.codigoRastreo} ahora está en estado «${nombre}».`,
      )
      setNuevoEstadoId('')
      setComentario('')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo actualizar el estado.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section
      className="sender-shipments create-shipment"
      aria-labelledby="update-status-title"
    >
      <header className="sender-section-header">
        <div>
          <h2 id="update-status-title">Actualizar estado</h2>
          <p>Registra el avance de una entrega y deja un comentario.</p>
        </div>
      </header>

      <form className="create-shipment-form" onSubmit={handleSubmit}>
        <section
          className="create-shipment-section"
          aria-labelledby="delivery-pick-title"
        >
          <h3 id="delivery-pick-title">Entrega</h3>
          <div className="create-shipment-grid">
            <div className="quote-field">
              <label htmlFor="entrega-envio">Envío</label>
              <select
                id="entrega-envio"
                value={envioId}
                onChange={(event) => {
                  setEnvioId(event.currentTarget.value)
                  setConfirmacion(null)
                  setError(null)
                }}
                required
              >
                <option value="">Selecciona un envío</option>
                {entregas.map((entrega) => (
                  <option key={entrega.envioId} value={entrega.envioId}>
                    {entrega.codigoRastreo} · {entrega.receptor}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-field">
              <label htmlFor="entrega-estado-actual">Estado actual</label>
              <input
                id="entrega-estado-actual"
                type="text"
                value={entregaActual?.estadoActual ?? '—'}
                readOnly
              />
            </div>
            {entregaActual && (
              <div className="quote-field create-shipment-field--wide">
                <label htmlFor="entrega-direccion">Dirección de entrega</label>
                <input
                  id="entrega-direccion"
                  type="text"
                  value={entregaActual.direccionDestino}
                  readOnly
                />
              </div>
            )}
          </div>
        </section>

        <section
          className="create-shipment-section"
          aria-labelledby="new-status-title"
        >
          <h3 id="new-status-title">Nuevo estado</h3>
          <div className="create-shipment-grid">
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="entrega-nuevo-estado">Estado</label>
              <select
                id="entrega-nuevo-estado"
                value={nuevoEstadoId}
                onChange={(event) => setNuevoEstadoId(event.currentTarget.value)}
                required
              >
                <option value="">Selecciona un estado</option>
                {estadosDisponibles.map((estado) => (
                  <option key={estado.estadoId} value={estado.estadoId}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-field create-shipment-field--wide">
              <label htmlFor="entrega-comentario">
                Comentario <span className="optional-label">(opcional)</span>
              </label>
              <textarea
                id="entrega-comentario"
                name="comentario"
                rows={3}
                placeholder="Ej. Paquete entregado a recepción"
                value={comentario}
                onChange={(event) => setComentario(event.currentTarget.value)}
              />
            </div>
          </div>
        </section>

        <footer className="create-shipment-footer">
          <p
            className={`quote-demo-note${error ? ' form-message--error' : ''}`}
            role={error ? 'alert' : 'status'}
          >
            {error ?? confirmacion ?? ''}
          </p>
          <button
            className="quote-submit"
            type="submit"
            disabled={!entregaActual || nuevoEstadoId === '' || guardando}
          >
            {guardando ? 'Guardando…' : 'Guardar estado'}
          </button>
        </footer>
      </form>
    </section>
  )
}
