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

export interface EntregaDemostracion extends EnvioDemostracion {
  direccion: string
  comentario?: string
  ubicacionActual?: string
}

export const clasesPorEstado: Record<EstadoEnvio, string> = {
  Creado: 'creado',
  Recolectado: 'recolectado',
  'En tránsito': 'en-transito',
  'En reparto': 'en-reparto',
  Entregado: 'entregado',
  Incidencia: 'incidencia',
}
