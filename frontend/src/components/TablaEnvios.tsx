import type { EnvioDetalle } from '../types/envio.types'
import { EstadoEnvioBadge } from './EstadoEnvioBadge'
import { fechaLegible, formatoMoneda } from './formatoEnvio'

interface TablaProps {
  envios: EnvioDetalle[]
  onSeleccionar: (envio: EnvioDetalle) => void
}

type TablaEnviosProps = TablaProps & (
  | { vista: 'remitente' }
  | { vista: 'repartidor'; onActualizar: (envioId: number) => void }
  | { vista: 'receptor' }
)

export function TablaEnvios(props: TablaEnviosProps) {
  const { envios, onSeleccionar, vista } = props

  return (
    <div className="shipment-table-scroll">
      <table className="shipment-table">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">{vista === 'receptor' ? 'Remitente' : 'Receptor'}</th>
            <th scope="col">Dirección de entrega</th>
            <th scope="col">{vista === 'repartidor' ? 'Paquete' : 'Repartidor'}</th>
            <th scope="col">Creado</th>
            <th scope="col">Estado</th>
            {vista !== 'receptor' && (
              <th scope="col">
                {vista === 'remitente' ? 'Costo' : <span className="visually-hidden">Acciones</span>}
              </th>
            )}
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
                  aria-label={`Ver detalle ${vista === 'repartidor' ? 'de la entrega' : 'del envío'} ${envio.codigoRastreo}`}
                >
                  {envio.codigoRastreo}
                </button>
              </td>
              <td>{vista === 'receptor' ? envio.remitente : envio.receptor}</td>
              <td>{envio.direccionDestino}</td>
              <td>
                {vista === 'repartidor'
                  ? `${envio.descripcionPaquete} · ${envio.pesoKg} kg`
                  : envio.repartidor ?? 'Sin asignar'}
              </td>
              <td>{fechaLegible(envio.fechaCreacion)}</td>
              <td><EstadoEnvioBadge estado={envio.estadoActual} /></td>
              {props.vista === 'remitente' && <td>{formatoMoneda.format(envio.costoTotal)}</td>}
              {props.vista === 'repartidor' && (
                <td>
                  <button
                    className="shipment-action"
                    type="button"
                    onClick={() => props.onActualizar(envio.envioId)}
                  >
                    Actualizar
                  </button>
                </td>
              )}
            </tr>
          ))}
          {envios.length === 0 && (
            <tr>
              <td className="shipment-empty" colSpan={vista === 'receptor' ? 6 : 7}>
                {vista === 'repartidor'
                  ? 'No hay entregas que coincidan con los filtros.'
                  : vista === 'receptor'
                    ? 'No hay paquetes que coincidan con los filtros.'
                    : 'No hay envíos que coincidan con los filtros.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
