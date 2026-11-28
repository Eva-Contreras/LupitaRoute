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
  if (Number.isNaN(fecha.getTime())) return '—'

  // Si la fecha no incluye indicador de zona horaria (Z o ±HH:MM),
  // se asume que el servidor la envía en UTC, así que añadimos la Z
  const fechaConsolidada = valor.includes('Z') || /[+-]\d{2}:\d{2}$/.test(valor)
    ? fecha
    : new Date(valor + 'Z')

  return formatoFecha.format(fechaConsolidada)
}
