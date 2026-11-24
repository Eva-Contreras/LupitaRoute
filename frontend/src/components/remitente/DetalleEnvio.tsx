import { useEffect, useState } from 'react'
import { rastrearEnvio } from '../../services/envios'
import type { EnvioDetalle, EnvioRastreo } from '../../types/envio.types'
import { claseEstado } from '../../utils/claseEstado'

interface DetalleEnvioProps {
  envio: EnvioDetalle
  onVolver: (actualizado: EnvioRastreo | null) => void
}

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
})
const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

function fechaLegible(valor: string): string {
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? '—' : formatoFecha.format(fecha)
}

export function DetalleEnvio({ envio, onVolver }: DetalleEnvioProps) {
  const [rastreo, setRastreo] = useState<EnvioRastreo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [intento, setIntento] = useState(0)
  const [mensajeCopia, setMensajeCopia] = useState('')

  useEffect(() => {
    let vigente = true
    rastrearEnvio(envio.codigoRastreo)
      .then((resultado) => {
        if (resultado.envioId !== envio.envioId || resultado.codigoRastreo !== envio.codigoRastreo) {
          throw new Error('El rastreo devuelto no corresponde al envío seleccionado.')
        }
        if (vigente) setRastreo(resultado)
      })
      .catch((caughtError: unknown) => {
        if (vigente) {
          setError(caughtError instanceof Error ? caughtError.message : 'No se pudo consultar el historial.')
        }
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => { vigente = false }
  }, [envio.codigoRastreo, envio.envioId, intento])

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(envio.codigoRastreo)
      setMensajeCopia('Código copiado.')
    } catch {
      setMensajeCopia('No se pudo copiar. Puedes seleccionar el código y copiarlo manualmente.')
    }
  }

  function reintentar() {
    setError(null)
    setCargando(true)
    setIntento((actual) => actual + 1)
  }

  const detalle = rastreo ?? envio
  return (
    <section className="sender-shipments" aria-labelledby="detalle-envio-title">
      <header className="sender-section-header">
        <div>
          <h2 id="detalle-envio-title">Detalle del envío</h2>
          <p>{detalle.codigoRastreo}</p>
        </div>
        <button className="shipment-action" type="button" onClick={() => onVolver(rastreo)}>
          Volver a mis envíos
        </button>
      </header>

      <div className="shipment-detail">
        <div className="shipment-detail__actions">
          <button className="shipment-action" type="button" onClick={copiarCodigo}>
            Copiar código
          </button>
          <span role="status">{mensajeCopia}</span>
        </div>
        <dl className="shipment-detail__grid">
          <div><dt>Receptor</dt><dd>{detalle.receptor}</dd></div>
          <div><dt>Repartidor</dt><dd>{detalle.repartidor ?? 'Sin asignar'}</dd></div>
          <div><dt>Dirección de origen</dt><dd>{detalle.direccionOrigen}</dd></div>
          <div><dt>Dirección de entrega</dt><dd>{detalle.direccionDestino}</dd></div>
          <div><dt>Descripción del paquete</dt><dd>{detalle.descripcionPaquete}</dd></div>
          <div><dt>Peso</dt><dd>{detalle.pesoKg} kg</dd></div>
          <div><dt>Distancia</dt><dd>{detalle.distanciaKm} km</dd></div>
          <div><dt>Creado</dt><dd>{fechaLegible(detalle.fechaCreacion)}</dd></div>
          <div><dt>Costo</dt><dd>{formatoMoneda.format(detalle.costoTotal)}</dd></div>
          <div>
            <dt>Estado actual</dt>
            <dd><span className={`status-badge status-badge--${claseEstado(detalle.estadoActual)}`}>{detalle.estadoActual}</span></dd>
          </div>
        </dl>

        <section className="shipment-history" aria-labelledby="historial-title">
          <h3 id="historial-title">Historial de estados</h3>
          {cargando && <p role="status">Cargando historial…</p>}
          {error && (
            <div role="alert">
              <p className="panel-state__error">{error}</p>
              <p>Se muestran los datos de la lista; no fue posible actualizar el historial.</p>
              <button className="shipment-action" type="button" onClick={reintentar}>Reintentar</button>
            </div>
          )}
          {rastreo && rastreo.historial.length === 0 && <p>Aún no hay movimientos registrados.</p>}
          {rastreo && rastreo.historial.length > 0 && (
            <ol className="shipment-history__list">
              {rastreo.historial.map((movimiento) => (
                <li key={movimiento.historialId}>
                  <strong>{movimiento.estado}</strong>
                  <span>{fechaLegible(movimiento.fechaCambio)} · {movimiento.usuarioCambio}</span>
                  {movimiento.comentario && <p>{movimiento.comentario}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </section>
  )
}
