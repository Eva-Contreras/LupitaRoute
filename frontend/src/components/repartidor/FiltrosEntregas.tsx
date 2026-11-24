import type { EstadoPaquete } from '../../types/lupita.types'

interface FiltrosEntregasProps {
  estados: EstadoPaquete[]
  busqueda: string
  estado: string
  fechaDesde: string
  fechaHasta: string
  onCambiarBusqueda: (value: string) => void
  onCambiarEstado: (value: string) => void
  onCambiarFechaDesde: (value: string) => void
  onCambiarFechaHasta: (value: string) => void
}

export function FiltrosEntregas({
  estados,
  busqueda,
  estado,
  fechaDesde,
  fechaHasta,
  onCambiarBusqueda,
  onCambiarEstado,
  onCambiarFechaDesde,
  onCambiarFechaHasta,
}: FiltrosEntregasProps) {
  return (
    <div className="shipment-filters" aria-label="Filtros de entregas">
      <label className="shipment-filter shipment-filter--search">
        <span>Buscar</span>
        <input
          type="search"
          value={busqueda}
          onChange={(event) => onCambiarBusqueda(event.currentTarget.value)}
          placeholder="Código o receptor"
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
            <option key={item.estadoId} value={item.nombre}>
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
