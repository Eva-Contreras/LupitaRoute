export const ESTADOS_ENVIO = [
  'Creado',
  'Recolectado',
  'En tránsito',
  'En reparto',
  'Entregado',
  'Incidencia',
] as const

export type EstadoEnvio = (typeof ESTADOS_ENVIO)[number]

export interface EnvioDemostracion {
  codigo: string
  destinatario: string
  destino: string
  ultimaActualizacion: string
  estado: EstadoEnvio
  costo: number
}

export function esEstadoEnvio(value: string): value is EstadoEnvio {
  return ESTADOS_ENVIO.some((estado) => estado === value)
}
