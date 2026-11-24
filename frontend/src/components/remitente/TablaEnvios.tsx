import type { EstadoEnvio, EnvioDemostracion } from '../../types/envio.types'

interface TablaEnviosProps {
  envios: EnvioDemostracion[]
}

const clasesPorEstado: Record<EstadoEnvio, string> = {
  Creado: 'creado',
  Recolectado: 'recolectado',
  'En tránsito': 'en-transito',
  'En reparto': 'en-reparto',
  Entregado: 'entregado',
  Incidencia: 'incidencia',
}

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function TablaEnvios({ envios }: TablaEnviosProps) {
  return (
    <div className="shipment-table-scroll">
      <table className="shipment-table">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Destinatario</th>
            <th scope="col">Destino</th>
            <th scope="col">Última actualización</th>
            <th scope="col">Estado</th>
            <th scope="col">Costo</th>
          </tr>
        </thead>
        <tbody>
          {envios.map((envio) => (
            <tr key={envio.codigo}>
              <td className="shipment-code">{envio.codigo}</td>
              <td>{envio.destinatario}</td>
              <td>{envio.destino}</td>
              <td>
                {formatoFecha.format(new Date(envio.ultimaActualizacion))}
              </td>
              <td>
                <span
                  className={`status-badge status-badge--${clasesPorEstado[envio.estado]}`}
                >
                  {envio.estado}
                </span>
              </td>
              <td>${envio.costo.toFixed(2)}</td>
            </tr>
          ))}
          {envios.length === 0 && (
            <tr>
              <td className="shipment-empty" colSpan={6}>
                No hay envíos que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
