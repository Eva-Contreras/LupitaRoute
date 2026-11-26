export function filtrarPorFecha<T extends { fechaCreacion: string }>(
  envios: T[],
  fechaDesde: string,
  fechaHasta: string,
): T[] {
  return envios.filter((envio) => {
    const fechaCreacion = envio.fechaCreacion.slice(0, 10)
    return (
      (fechaDesde === '' || fechaCreacion >= fechaDesde) &&
      (fechaHasta === '' || fechaCreacion <= fechaHasta)
    )
  })
}
