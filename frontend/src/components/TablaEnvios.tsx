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
)

export function TablaEnvios(props: TablaEnviosProps) {
  const { envios, onSeleccionar, vista } = props

  return (
    <div className="shipment-table-scroll">
      <table className="shipment-table">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Receptor</th>
            <th scope="col">Dirección de entrega</th>
            <th scope="col">{vista === 'remitente' ? 'Repartidor' : 'Paquete'}</th>
            <th scope="col">Creado</th>
            <th scope="col">Estado</th>
            <th scope="col">
              {vista === 'remitente' ? 'Costo' : <span className="visually-hidden">Acciones</span>}
            </th>
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
                  aria-label={`Ver detalle ${vista === 'remitente' ? 'del envío' : 'de la entrega'} ${envio.codigoRastreo}`}
                >
                  {envio.codigoRastreo}
                </button>
              </td>
              <td>{envio.receptor}</td>
              <td>{envio.direccionDestino}</td>
              <td>
                {vista === 'remitente'
                  ? envio.repartidor ?? 'Sin asignar'
                  : `${envio.descripcionPaquete} · ${envio.pesoKg} kg`}
              </td>
              <td>{fechaLegible(envio.fechaCreacion)}</td>
              <td><EstadoEnvioBadge estado={envio.estadoActual} /></td>
              <td>
                {props.vista === 'remitente' ? (
                  formatoMoneda.format(envio.costoTotal)
                ) : (
                  <button
                    className="shipment-action"
                    type="button"
                    onClick={() => props.onActualizar(envio.envioId)}
                  >
                    Actualizar
                  </button>
                )}
              </td>
            </tr>
          ))}
          {envios.length === 0 && (
            <tr>
              <td className="shipment-empty" colSpan={7}>
                {vista === 'remitente'
                  ? 'No hay envíos que coincidan con los filtros.'
                  : 'No hay entregas que coincidan con los filtros.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
