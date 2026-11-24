import { useState, type FormEvent } from 'react'
import { ESTADOS_ENVIO, esEstadoEnvio } from '../../types/envio.types'
import type { EntregaDemostracion, EstadoEnvio } from '../../types/envio.types'

interface ActualizarEstadoProps {
  entregas: EntregaDemostracion[]
  codigoInicial: string
  onGuardar: (
    codigo: string,
    estado: EstadoEnvio,
    comentario: string,
    ubicacionActual: string,
  ) => void
}

// El repartidor no puede regresar un paquete a "Creado".
const ESTADOS_REPARTIDOR = ESTADOS_ENVIO.filter((estado) => estado !== 'Creado')

export function ActualizarEstado({
  entregas,
  codigoInicial,
  onGuardar,
}: ActualizarEstadoProps) {
  const [codigo, setCodigo] = useState(codigoInicial)
  const [nuevoEstado, setNuevoEstado] = useState<EstadoEnvio | ''>('')
  const [comentario, setComentario] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [confirmacion, setConfirmacion] = useState<string | null>(null)

  const entregaActual = entregas.find((entrega) => entrega.codigo === codigo)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!entregaActual || nuevoEstado === '') {
      return
    }

    onGuardar(codigo, nuevoEstado, comentario.trim(), ubicacion.trim())
    setConfirmacion(`${codigo} ahora está en estado «${nuevoEstado}».`)
    setNuevoEstado('')
    setComentario('')
    setUbicacion('')
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
        <span className="section-caption">Formulario de demostración</span>
      </header>

      <form className="create-shipment-form" onSubmit={handleSubmit}>
        <section
          className="create-shipment-section"
          aria-labelledby="delivery-pick-title"
        >
          <h3 id="delivery-pick-title">Entrega</h3>
          <div className="create-shipment-grid">
            <div className="quote-field">
              <label htmlFor="entrega-codigo">Envío</label>
              <select
                id="entrega-codigo"
                value={codigo}
                onChange={(event) => {
                  setCodigo(event.currentTarget.value)
                  setConfirmacion(null)
                }}
                required
              >
                <option value="">Selecciona un envío</option>
                {entregas.map((entrega) => (
                  <option key={entrega.codigo} value={entrega.codigo}>
                    {entrega.codigo} · {entrega.destinatario}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-field">
              <label htmlFor="entrega-estado-actual">Estado actual</label>
              <input
                id="entrega-estado-actual"
                type="text"
                value={entregaActual?.estado ?? '—'}
                readOnly
              />
            </div>
            {entregaActual && (
              <div className="quote-field create-shipment-field--wide">
                <label htmlFor="entrega-direccion">Dirección de entrega</label>
                <input
                  id="entrega-direccion"
                  type="text"
                  value={entregaActual.direccion}
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
            <div className="quote-field">
              <label htmlFor="entrega-nuevo-estado">Estado</label>
              <select
                id="entrega-nuevo-estado"
                value={nuevoEstado}
                onChange={(event) => {
                  const value = event.currentTarget.value
                  if (value === '' || esEstadoEnvio(value)) {
                    setNuevoEstado(value)
                  }
                }}
                required
              >
                <option value="">Selecciona un estado</option>
                {ESTADOS_REPARTIDOR.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-field">
              <label htmlFor="entrega-ubicacion">
                Ubicación actual{' '}
                <span className="optional-label">(opcional)</span>
              </label>
              <input
                id="entrega-ubicacion"
                name="ubicacionActual"
                type="text"
                placeholder="Ej. Zona Centro"
                value={ubicacion}
                onChange={(event) => setUbicacion(event.currentTarget.value)}
              />
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
          <p className="quote-demo-note" role="status">
            {confirmacion ??
              'Este formulario es visual. El cambio no se guardará hasta conectar la API.'}
          </p>
          <button
            className="quote-submit"
            type="submit"
            disabled={!entregaActual || nuevoEstado === ''}
          >
            Guardar estado
          </button>
        </footer>
      </form>
    </section>
  )
}
