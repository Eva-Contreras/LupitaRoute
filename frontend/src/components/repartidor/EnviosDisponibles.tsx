import { useEffect, useState } from 'react'
import { aErrorVista, type ErrorVista } from '../../hooks/useListaEnvios'
import { asignarEnvio, obtenerEnviosDisponibles } from '../../services/envios'
import type { EnvioDetalle } from '../../types/envio.types'
import { EstadoEnvioBadge } from '../EstadoEnvioBadge'
import { ConfirmarRecoleccion } from './ConfirmarRecoleccion'

interface EnviosDisponiblesProps {
  token: string
  onSesionExpirada: () => void
  onRecolectar: (envioId: number, codigo: string) => Promise<void>
  registrando: boolean
}

function AvisoError({ error, onSesionExpirada, onReintentar }: {
  error: ErrorVista
  onSesionExpirada: () => void
  onReintentar?: () => void
}) {
  return (
    <div className="panel-state" role="alert">
      <p className="panel-state__error">{error.mensaje}</p>
      {error.sesionExpirada ? (
        <button className="shipment-action" type="button" onClick={onSesionExpirada}>
          Volver a iniciar sesión
        </button>
      ) : (
        onReintentar && (
          <button className="shipment-action" type="button" onClick={onReintentar}>
            Reintentar
          </button>
        )
      )}
    </div>
  )
}

export function EnviosDisponibles({
  token,
  onSesionExpirada,
  onRecolectar,
  registrando,
}: EnviosDisponiblesProps) {
  const [envios, setEnvios] = useState<EnvioDetalle[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<ErrorVista | null>(null)
  const [intento, setIntento] = useState(0)
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)
  const [asignandoEnvioId, setAsignandoEnvioId] = useState<number | null>(null)
  const [mensajeAsignacion, setMensajeAsignacion] = useState<string | null>(null)
  const [errorAsignacion, setErrorAsignacion] = useState<ErrorVista | null>(null)
  const [errorRecoleccion, setErrorRecoleccion] = useState<ErrorVista | null>(null)

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
          setError(aErrorVista(caughtError, 'No se pudieron consultar los envíos disponibles.'))
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

  async function asignarAmi(envio: EnvioDetalle) {
    if (asignandoEnvioId !== null) return
    setAsignandoEnvioId(envio.envioId)
    setErrorAsignacion(null)
    setMensajeAsignacion(null)
    try {
      await asignarEnvio(token, envio.envioId)
      setMensajeAsignacion(`El envío ${envio.codigoRastreo} quedó asignado a tu cuenta.`)
      recargar()
    } catch (caughtError: unknown) {
      setErrorAsignacion(aErrorVista(caughtError, 'No se pudo asignar el envío.'))
    } finally {
      setAsignandoEnvioId(null)
    }
  }

  async function confirmarRecoleccion() {
    if (!seleccionado || registrando) return
    setErrorRecoleccion(null)
    try {
      await onRecolectar(seleccionado.envioId, seleccionado.codigoRastreo)
    } catch (caughtError: unknown) {
      setErrorRecoleccion(aErrorVista(caughtError, 'No se pudo registrar la recolección.'))
    }
  }

  if (seleccionado) {
    return (
      <ConfirmarRecoleccion
        envio={seleccionado}
        error={errorRecoleccion}
        registrando={registrando}
        onConfirmar={confirmarRecoleccion}
        onSesionExpirada={onSesionExpirada}
        onVolver={() => {
          setSeleccionado(null)
          setErrorRecoleccion(null)
          recargar()
        }}
      />
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
      {mensajeAsignacion && <p className="quote-demo-note" role="status">{mensajeAsignacion}</p>}
      {errorAsignacion && <AvisoError error={errorAsignacion} onSesionExpirada={onSesionExpirada} />}
      {cargando ? (
        <div className="panel-state" role="status"><p>Cargando envíos disponibles…</p></div>
      ) : error ? (
        <AvisoError error={error} onSesionExpirada={onSesionExpirada} onReintentar={recargar} />
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
                <th scope="col">Acciones</th>
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
                  <td><EstadoEnvioBadge estado={envio.estadoActual} /></td>
                  <td>
                    <div className="shipment-actions">
                      <button
                        className="shipment-action"
                        type="button"
                        onClick={() => setSeleccionado(envio)}
                        disabled={asignandoEnvioId !== null}
                        aria-label={`Registrar recolección del envío ${envio.codigoRastreo}`}
                      >
                        Registrar recolección
                      </button>
                      <button
                        className="shipment-action"
                        type="button"
                        onClick={() => asignarAmi(envio)}
                        disabled={asignandoEnvioId !== null || registrando}
                      >
                        {asignandoEnvioId === envio.envioId ? 'Asignando…' : 'Asignar a mí'}
                      </button>
                    </div>
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
