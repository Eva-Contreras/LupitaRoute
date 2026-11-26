import type { EstadoPaquete } from '../types/envio.types'

interface FiltrosEnviosProps {
  etiqueta: string
  estados: EstadoPaquete[]
  busqueda: string
  estado: string
  fechaDesde: string
  fechaHasta: string
  placeholderBusqueda?: string
  onCambiarBusqueda: (value: string) => void
  onCambiarEstado: (value: string) => void
  onCambiarFechaDesde: (value: string) => void
  onCambiarFechaHasta: (value: string) => void
}

export function FiltrosEnvios({
  etiqueta,
  estados,
  busqueda,
  estado,
  fechaDesde,
  fechaHasta,
  placeholderBusqueda = 'Código o receptor',
  onCambiarBusqueda,
  onCambiarEstado,
  onCambiarFechaDesde,
  onCambiarFechaHasta,
}: FiltrosEnviosProps) {
  return (
    <div className="shipment-filters" aria-label={etiqueta}>
      <label className="shipment-filter shipment-filter--search">
        <span>Buscar</span>
        <input
          type="search"
          value={busqueda}
          onChange={(event) => onCambiarBusqueda(event.currentTarget.value)}
          placeholder={placeholderBusqueda}
        />
      </label>
      <label className="shipment-filter">
        <span>Estado</span>
        <select
          value={estado}
          onChange={(event) => onCambiarEstado(event.currentTarget.value)}
        >
          <option value="">Todos los estados</option>
          {estados.map((item) => (
            <option key={item.estadoId} value={String(item.estadoId)}>
              {item.nombre}
            </option>
          ))}
        </select>
      </label>
      <label className="shipment-filter">
        <span>Creado desde</span>
        <input
          type="date"
          value={fechaDesde}
          onChange={(event) => onCambiarFechaDesde(event.currentTarget.value)}
        />
      </label>
      <label className="shipment-filter">
        <span>Creado hasta</span>
        <input
          type="date"
          value={fechaHasta}
          onChange={(event) => onCambiarFechaHasta(event.currentTarget.value)}
        />
      </label>
    </div>
  )
}
