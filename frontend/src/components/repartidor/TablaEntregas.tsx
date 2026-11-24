import { claseEstado } from './claseEstado'
import type { EnvioDetalle } from '../../types/lupita.types'

interface TablaEntregasProps {
  entregas: EnvioDetalle[]
  onActualizar: (envioId: number) => void
}

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function fechaLegible(valor: string): string {
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? '—' : formatoFecha.format(fecha)
}

export function TablaEntregas({ entregas, onActualizar }: TablaEntregasProps) {
  return (
    <div className="shipment-table-scroll">
      <table className="shipment-table">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Receptor</th>
            <th scope="col">Dirección de entrega</th>
            <th scope="col">Paquete</th>
            <th scope="col">Creado</th>
            <th scope="col">Estado</th>
            <th scope="col">
              <span className="visually-hidden">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((entrega) => (
            <tr key={entrega.envioId}>
              <td className="shipment-code">{entrega.codigoRastreo}</td>
              <td>{entrega.receptor}</td>
              <td>{entrega.direccionDestino}</td>
              <td>
                {entrega.descripcionPaquete} · {entrega.pesoKg} kg
              </td>
              <td>{fechaLegible(entrega.fechaCreacion)}</td>
              <td>
                <span
                  className={`status-badge status-badge--${claseEstado(entrega.estadoActual)}`}
                >
                  {entrega.estadoActual}
                </span>
              </td>
              <td>
                <button
                  className="shipment-action"
                  type="button"
                  onClick={() => onActualizar(entrega.envioId)}
                >
                  Actualizar
                </button>
              </td>
            </tr>
          ))}
          {entregas.length === 0 && (
            <tr>
              <td className="shipment-empty" colSpan={7}>
                No hay entregas que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
