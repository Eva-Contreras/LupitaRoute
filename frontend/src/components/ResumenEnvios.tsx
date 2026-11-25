import { useEffect, useState } from 'react'
import { ErrorApi, obtenerResumen } from '../services/envios'
import type { RolNombre } from '../types/auth.types'
import type { ResumenEnvios as DatosResumen } from '../types/envio.types'
import { formatoMoneda } from './formatoEnvio'

interface ResumenEnviosProps {
  token: string
  rol: RolNombre
  actualizacion: number
  onSesionExpirada: () => void
}

type EstadoResumen =
  | { tipo: 'cargando' }
  | { tipo: 'listo'; datos: DatosResumen }
  | { tipo: 'error'; mensaje: string; sesionExpirada: boolean }

export function ResumenEnvios({ token, rol, actualizacion, onSesionExpirada }: ResumenEnviosProps) {
  const [estado, setEstado] = useState<EstadoResumen>({ tipo: 'cargando' })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true
    obtenerResumen(token)
      .then((datos) => {
        if (vigente) setEstado({ tipo: 'listo', datos })
      })
      .catch((error: unknown) => {
        if (vigente) {
          setEstado({
            tipo: 'error',
            mensaje: error instanceof Error ? error.message : 'No se pudo consultar el resumen.',
            sesionExpirada: error instanceof ErrorApi && error.estado === 401,
          })
        }
      })
    return () => { vigente = false }
  }, [token, actualizacion, intento])

  if (estado.tipo === 'cargando') return <p className="resumen-estado" role="status">Cargando resumen…</p>
  if (estado.tipo === 'error') {
    return (
      <div className="resumen-estado" role="alert">
        <p>No se pudo cargar el resumen: {estado.mensaje}</p>
        <button className="shipment-action" type="button" onClick={() => {
          if (estado.sesionExpirada) {
            onSesionExpirada()
          } else {
            setEstado({ tipo: 'cargando' })
            setIntento((actual) => actual + 1)
          }
        }}>
          {estado.sesionExpirada ? 'Volver a iniciar sesión' : 'Reintentar'}
        </button>
      </div>
    )
  }

  const { datos } = estado
  const enReparto = datos.desglosePorEstado.find(
    (item) => item.estado.trim().toLocaleLowerCase('es-MX') === 'en reparto',
  )
  const metricas = [
    { etiqueta: rol === 'Repartidor' ? 'Entregas asignadas' : 'Total de envíos', valor: datos.totalEnvios },
    { etiqueta: 'Activos', valor: datos.enviosActivos },
    ...(rol === 'Repartidor' ? [{ etiqueta: 'En reparto', valor: enReparto?.cantidad ?? '—' }] : []),
    { etiqueta: 'Entregados', valor: datos.enviosEntregados },
    { etiqueta: 'Con incidencia', valor: datos.enviosConIncidencia },
    ...(rol === 'Remitente' ? [{ etiqueta: 'Monto total operado', valor: formatoMoneda.format(datos.montoTotalOperado) }] : []),
  ]

  return (
    <section aria-label="Resumen de envíos">
      <p className="resumen-estado">Resumen de todos tus envíos, sin aplicar filtros.</p>
      <div className="courier-metrics">
        {metricas.map((metrica) => (
          <article className="metric-card" key={metrica.etiqueta}>
            <span>{metrica.etiqueta}</span>
            <strong>{metrica.valor}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
