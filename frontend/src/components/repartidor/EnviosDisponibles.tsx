import { useEffect, useState } from 'react'
import { ErrorApi, obtenerEnviosDisponibles } from '../../services/envios'
import type { EnvioDetalle } from '../../types/envio.types'
import { claseEstado } from '../../utils/claseEstado'

interface EnviosDisponiblesProps {
  token: string
  onSesionExpirada: () => void
  onRecolectar: (envioId: number, codigo: string) => Promise<void>
  registrando: boolean
}

export function EnviosDisponibles({
  token,
  onSesionExpirada,
  onRecolectar,
  registrando,
}: EnviosDisponiblesProps) {
  const [envios, setEnvios] = useState<EnvioDetalle[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<{ mensaje: string; sesionExpirada: boolean } | null>(null)
  const [intento, setIntento] = useState(0)
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)
  const [errorRecoleccion, setErrorRecoleccion] = useState<{
    mensaje: string
    sesionExpirada: boolean
  } | null>(null)

  useEffect(() => {
    let vigente = true
    obtenerEnviosDisponibles(token)
      .then((resultado) => {
        if (vigente) {
          setEnvios(resultado)
          setError(null)
        }
      })
      .catch((caughtError: unknown) => {
        if (vigente) {
          setError({
            mensaje: caughtError instanceof Error ? caughtError.message : 'No se pudieron consultar los envíos disponibles.',
            sesionExpirada: caughtError instanceof ErrorApi && caughtError.estado === 401,
          })
        }
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => { vigente = false }
  }, [token, intento])

  function recargar() {
    setCargando(true)
    setError(null)
    setIntento((actual) => actual + 1)
  }

  async function confirmarRecoleccion() {
    if (!seleccionado || registrando) return
    setErrorRecoleccion(null)
    try {
      await onRecolectar(seleccionado.envioId, seleccionado.codigoRastreo)
    } catch (caughtError: unknown) {
      setErrorRecoleccion({
        mensaje: caughtError instanceof Error ? caughtError.message : 'No se pudo registrar la recolección.',
        sesionExpirada: caughtError instanceof ErrorApi && caughtError.estado === 401,
      })
    }
  }

  if (seleccionado) {
    return (
      <section className="sender-shipments courier-pickup" aria-labelledby="confirmar-recoleccion-title">
        <header className="courier-pickup__header">
          <div className="courier-pickup__heading">
            <span className="courier-pickup__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
                <path d="m3 7 9 4 9-4M12 11v10M7.5 5l9 4" />
              </svg>
            </span>
            <div>
              <span className="courier-pickup__eyebrow">Recolección de paquete</span>
              <h2 id="confirmar-recoleccion-title">Registrar recolección</h2>
              <p>Revisa los datos antes de continuar.</p>
            </div>
          </div>
          <div className="courier-pickup__code">
            <span>Código de rastreo</span>
            <strong>{seleccionado.codigoRastreo}</strong>
          </div>
        </header>
        <div className="courier-confirmation">
          <div className="courier-pickup__details">
            <div className="courier-pickup__recipient">
              <span className="courier-pickup__label">Receptor</span>
              <strong>{seleccionado.receptor}</strong>
            </div>
            <div className="courier-pickup__route">
              <h3>Ruta del envío</h3>
              <dl className="courier-pickup__stops">
                <div className="courier-pickup__stop">
                  <dt>Dirección de origen</dt>
                  <dd>{seleccionado.direccionOrigen}</dd>
                </div>
                <div className="courier-pickup__stop">
                  <dt>Dirección de entrega</dt>
                  <dd>{seleccionado.direccionDestino}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="courier-pickup__notice">
            <span className="courier-pickup__notice-icon" aria-hidden="true">!</span>
            <div>
              <strong>Antes de confirmar</strong>
              <p>Confirma solo si ya recolectaste el paquete. Se cambiará su estado a Recolectado y se intentará asignarlo a ti.</p>
            </div>
          </div>
          {errorRecoleccion && (
            <div className="courier-pickup__error" role="alert">
              <p className="panel-state__error">{errorRecoleccion.mensaje}</p>
              <p>Si la solicitud llegó al servidor, revisa Mis entregas antes de volver a intentarlo.</p>
              {errorRecoleccion.sesionExpirada && (
                <button className="shipment-action" type="button" onClick={onSesionExpirada}>
                  Volver a iniciar sesión
                </button>
              )}
            </div>
          )}
          <div className="courier-confirmation__actions">
            <button
              className="quote-submit courier-pickup__confirm"
              type="button"
              disabled={registrando || errorRecoleccion?.sesionExpirada}
              onClick={confirmarRecoleccion}
            >
              {registrando ? 'Registrando…' : 'Confirmar recolección'}
            </button>
            <button
              className="shipment-action courier-pickup__back"
              type="button"
              disabled={registrando}
              onClick={() => {
                setSeleccionado(null)
                setErrorRecoleccion(null)
                recargar()
              }}
            >
              Volver a disponibles
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="sender-shipments" aria-labelledby="available-title">
      <header className="sender-section-header">
        <div>
          <h2 id="available-title">Envíos disponibles</h2>
          <p>Selecciona un envío para registrar su recolección.</p>
        </div>
        <button className="shipment-action" type="button" onClick={recargar} disabled={cargando}>
          Actualizar lista
        </button>
      </header>
      {cargando ? (
        <div className="panel-state" role="status"><p>Cargando envíos disponibles…</p></div>
      ) : error ? (
        <div className="panel-state" role="alert">
          <p className="panel-state__error">{error.mensaje}</p>
          {error.sesionExpirada ? (
            <button className="shipment-action" type="button" onClick={onSesionExpirada}>Volver a iniciar sesión</button>
          ) : (
            <button className="shipment-action" type="button" onClick={recargar}>Reintentar</button>
          )}
        </div>
      ) : (
        <div className="shipment-table-scroll">
          <table className="shipment-table">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Receptor</th>
                <th scope="col">Dirección de origen</th>
                <th scope="col">Dirección de entrega</th>
                <th scope="col">Paquete</th>
                <th scope="col">Estado</th>
                <th scope="col"><span className="visually-hidden">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {envios.map((envio) => (
                <tr key={envio.envioId}>
                  <td className="shipment-code">{envio.codigoRastreo}</td>
                  <td>{envio.receptor}</td>
                  <td>{envio.direccionOrigen}</td>
                  <td>{envio.direccionDestino}</td>
                  <td>{envio.descripcionPaquete} · {envio.pesoKg} kg</td>
                  <td><span className={`status-badge status-badge--${claseEstado(envio.estadoActual)}`}>{envio.estadoActual}</span></td>
                  <td>
                    <button
                      className="shipment-action"
                      type="button"
                      onClick={() => setSeleccionado(envio)}
                      aria-label={`Registrar recolección del envío ${envio.codigoRastreo}`}
                    >
                      Registrar recolección
                    </button>
                  </td>
                </tr>
              ))}
              {envios.length === 0 && (
                <tr><td className="shipment-empty" colSpan={7}>No hay envíos disponibles.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
