const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function fechaLegible(valor: string): string {
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? '—' : formatoFecha.format(fecha)
}
