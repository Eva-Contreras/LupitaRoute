import { ESTADOS_ENVIO, esEstadoEnvio } from '../../types/envio.types'
import type { EstadoEnvio } from '../../types/envio.types'

interface FiltrosEnviosProps {
  busqueda: string
  estado: EstadoEnvio | ''
  fechaDesde: string
  fechaHasta: string
  onCambiarBusqueda: (value: string) => void
  onCambiarEstado: (value: EstadoEnvio | '') => void
  onCambiarFechaDesde: (value: string) => void
  onCambiarFechaHasta: (value: string) => void
}

export function FiltrosEnvios({
  busqueda,
  estado,
  fechaDesde,
  fechaHasta,
  onCambiarBusqueda,
  onCambiarEstado,
  onCambiarFechaDesde,
  onCambiarFechaHasta,
}: FiltrosEnviosProps) {
  return (
    <div className="shipment-filters" aria-label="Filtros de envíos">
      <label className="shipment-filter shipment-filter--search">
        <span>Buscar</span>
        <input
          type="search"
          value={busqueda}
          onChange={(event) => onCambiarBusqueda(event.currentTarget.value)}
          placeholder="Código o destinatario"
        />
      </label>
      <label className="shipment-filter">
        <span>Estado</span>
        <select
          value={estado}
          onChange={(event) => {
            const value = event.currentTarget.value
            if (value === '' || esEstadoEnvio(value)) {
              onCambiarEstado(value)
            }
          }}
        >
          <option value="">Todos los estados</option>
          {ESTADOS_ENVIO.map((estadoEnvio) => (
            <option key={estadoEnvio} value={estadoEnvio}>
              {estadoEnvio}
            </option>
          ))}
        </select>
      </label>
      <label className="shipment-filter">
        <span>Desde</span>
        <input
          type="date"
          value={fechaDesde}
          onChange={(event) => onCambiarFechaDesde(event.currentTarget.value)}
        />
      </label>
      <label className="shipment-filter">
        <span>Hasta</span>
        <input
          type="date"
          value={fechaHasta}
          onChange={(event) => onCambiarFechaHasta(event.currentTarget.value)}
        />
      </label>
    </div>
  )
}
