import { claseEstado } from '../../utils/claseEstado'
import type { EnvioDetalle } from '../../types/envio.types'

interface TablaEnviosProps {
  envios: EnvioDetalle[]
  onSeleccionar: (envio: EnvioDetalle) => void
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

export function TablaEnvios({ envios, onSeleccionar }: TablaEnviosProps) {
  return (
    <div className="shipment-table-scroll">
      <table className="shipment-table">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Receptor</th>
            <th scope="col">Dirección de entrega</th>
            <th scope="col">Repartidor</th>
            <th scope="col">Creado</th>
            <th scope="col">Estado</th>
            <th scope="col">Costo</th>
          </tr>
        </thead>
        <tbody>
          {envios.map((envio) => (
            <tr key={envio.envioId}>
              <td className="shipment-code">
                <button
                  type="button"
                  className="shipment-code-button"
                  onClick={() => onSeleccionar(envio)}
                  aria-label={`Ver detalle del envío ${envio.codigoRastreo}`}
                >
                  {envio.codigoRastreo}
                </button>
              </td>
              <td>{envio.receptor}</td>
              <td>{envio.direccionDestino}</td>
              <td>{envio.repartidor ?? 'Sin asignar'}</td>
              <td>{fechaLegible(envio.fechaCreacion)}</td>
              <td>
                <span
                  className={`status-badge status-badge--${claseEstado(envio.estadoActual)}`}
                >
                  {envio.estadoActual}
                </span>
              </td>
              <td>{formatoMoneda.format(envio.costoTotal)}</td>
            </tr>
          ))}
          {envios.length === 0 && (
            <tr>
              <td className="shipment-empty" colSpan={7}>
                No hay envíos que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
