import { useState, type FormEvent } from 'react'
import { DetalleEnvio } from '../DetalleEnvio'
import { EstadoEnvioBadge } from '../EstadoEnvioBadge'
import { fechaLegible } from '../formatoEnvio'
import { ErrorApi, rastrearEnvio, rastrearEnvioPublico } from '../../services/envios'
import type { EnvioDetalle, EnvioRastreo, EnvioRastreoPublico } from '../../types/envio.types'

interface RastrearPaqueteProps {
  token: string
  onActualizarLista: (envio: EnvioDetalle) => void
}

export function RastrearPaquete({ token, onActualizarLista }: RastrearPaqueteProps) {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState<EnvioRastreo | null>(null)
  const [resultadoPublico, setResultadoPublico] = useState<EnvioRastreoPublico | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function consultar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const codigoLimpio = codigo.trim()
    if (!codigoLimpio) {
      setError('Ingresa un código de rastreo.')
      return
    }

    setCargando(true)
    setError(null)
    try {
      try {
        const envio = await rastrearEnvio(token, codigoLimpio)
        setResultado(envio)
        onActualizarLista(envio)
      } catch (caughtError: unknown) {
        // 403: el envío existe pero no está asociado a la cuenta; se muestra la vista pública.
        if (!(caughtError instanceof ErrorApi) || caughtError.estado !== 403) {
          throw caughtError
        }
        setResultadoPublico(await rastrearEnvioPublico(codigoLimpio))
      }
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'No se pudo consultar el envío.')
    } finally {
      setCargando(false)
    }
  }

  if (resultado) {
    return (
      <DetalleEnvio
        token={token}
        envio={resultado}
        rastreoInicial={resultado}
        mostrarRemitente
        textoVolver="Volver a rastrear"
        onVolver={(actualizado) => {
          if (actualizado) onActualizarLista(actualizado)
          setResultado(null)
        }}
      />
    )
  }

  if (resultadoPublico) {
    return (
      <section className="sender-shipments" aria-labelledby="detalle-publico-title">
        <header className="sender-section-header">
          <div>
            <h2 id="detalle-publico-title">Rastreo del envío</h2>
            <p>{resultadoPublico.codigoRastreo}</p>
          </div>
          <button className="shipment-action" type="button" onClick={() => setResultadoPublico(null)}>
            Volver a rastrear
          </button>
        </header>
        <div className="shipment-detail">
          <dl className="shipment-detail__grid">
            <div><dt>Creado</dt><dd>{fechaLegible(resultadoPublico.fechaCreacion)}</dd></div>
            <div>
              <dt>Estado actual</dt>
              <dd><EstadoEnvioBadge estado={resultadoPublico.estadoActual} /></dd>
            </div>
          </dl>
          <section className="shipment-history" aria-labelledby="historial-publico-title">
            <h3 id="historial-publico-title">Historial de estados</h3>
            {resultadoPublico.historial.length === 0 ? (
              <p>Aún no hay movimientos registrados.</p>
            ) : (
              <ol className="shipment-history__list">
                {resultadoPublico.historial.map((movimiento, indice) => (
                  <li key={`${movimiento.fechaCambio}-${indice}`}>
                    <strong>{movimiento.estado}</strong>
                    <span>{fechaLegible(movimiento.fechaCambio)}</span>
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

  return (
    <section className="dashboard-section tracking-card" aria-labelledby="tracking-title">
      <h2 id="tracking-title">Rastrea tu paquete</h2>
      <p>Ingresa el código de rastreo que te compartieron.</p>
      <form className="tracking-form" onSubmit={consultar}>
        <label className="visually-hidden" htmlFor="codigo-rastreo">Código de rastreo</label>
        <input
          id="codigo-rastreo"
          name="codigo-rastreo"
          type="text"
          placeholder="Ej. LUP-2026-0001"
          value={codigo}
          onChange={(event) => setCodigo(event.currentTarget.value)}
          required
          disabled={cargando}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Consultando…' : 'Consultar'}
        </button>
      </form>
      {error && <div role="alert"><p className="panel-state__error">{error}</p></div>}
    </section>
  )
}
