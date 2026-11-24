import { clasesPorEstado } from '../../types/envio.types'
import type { EntregaDemostracion } from '../../types/envio.types'

interface TablaEntregasProps {
  entregas: EntregaDemostracion[]
  onActualizar: (codigo: string) => void
}

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function TablaEntregas({ entregas, onActualizar }: TablaEntregasProps) {
  return (
    <div className="shipment-table-scroll">
      <table className="shipment-table">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Destinatario</th>
            <th scope="col">Dirección de entrega</th>
            <th scope="col">Última actualización</th>
            <th scope="col">Estado</th>
            <th scope="col">
              <span className="visually-hidden">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((entrega) => (
            <tr key={entrega.codigo}>
              <td className="shipment-code">{entrega.codigo}</td>
              <td>{entrega.destinatario}</td>
              <td>{entrega.direccion}</td>
              <td>
                {formatoFecha.format(new Date(entrega.ultimaActualizacion))}
              </td>
              <td>
                <span
                  className={`status-badge status-badge--${clasesPorEstado[entrega.estado]}`}
                >
                  {entrega.estado}
                </span>
              </td>
              <td>
                <button
                  className="shipment-action"
                  type="button"
                  onClick={() => onActualizar(entrega.codigo)}
                >
                  Actualizar
                </button>
              </td>
            </tr>
          ))}
          {entregas.length === 0 && (
            <tr>
              <td className="shipment-empty" colSpan={6}>
                No hay entregas que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
