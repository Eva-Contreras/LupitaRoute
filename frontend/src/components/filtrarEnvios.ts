import type { EnvioDetalle } from '../types/envio.types'

interface Filtros {
  busqueda: string
  estado: string
  fechaDesde: string
  fechaHasta: string
}

export function filtrarEnvios(envios: EnvioDetalle[], filtros: Filtros): EnvioDetalle[] {
  const termino = filtros.busqueda.trim().toLocaleLowerCase()
  return envios
    .filter((envio) => {
      const coincideBusqueda =
        termino.length === 0 ||
        envio.codigoRastreo.toLocaleLowerCase().includes(termino) ||
        envio.receptor.toLocaleLowerCase().includes(termino)
      const fechaCreacion = envio.fechaCreacion.slice(0, 10)
      const coincideEstado = filtros.estado === '' || envio.estadoActual === filtros.estado
      const coincideFechaDesde = filtros.fechaDesde === '' || fechaCreacion >= filtros.fechaDesde
      const coincideFechaHasta = filtros.fechaHasta === '' || fechaCreacion <= filtros.fechaHasta

      return coincideBusqueda && coincideEstado && coincideFechaDesde && coincideFechaHasta
    })
    .sort(
      (a, b) =>
        (new Date(b.fechaCreacion).getTime() || 0) -
        (new Date(a.fechaCreacion).getTime() || 0),
    )
}
