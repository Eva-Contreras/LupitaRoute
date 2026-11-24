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

export interface TarifaEnvio {
  tarifaId: number
  zonaOrigen: string
  zonaDestino: string
  costoBase: number
  costoPorKgExtra: number
  diasEstimados: number
}

export interface CotizacionRequest {
  zonaOrigen: string
  zonaDestino: string
  pesoKg: number
}

export interface CotizacionResponse {
  zonaOrigen: string
  zonaDestino: string
  pesoKg: number
  costoTotal: number
  diasEstimados: number
}

export interface EstadoPaquete {
  estadoId: number
  nombre: string
  descripcion: string
}

export interface Envio {
  envioId: number
  codigoRastreo: string
  remitenteId: number
  nombreRemitente?: string
  receptorId?: number
  nombreReceptorExterno: string
  direccionEntrega: string
  repartidorId?: number
  pesoKg: number
  dimensiones?: string
  costoTotal: number
  estadoActualId: number
  estadoNombre: string
  fechaCreacion: string
}

export interface CrearEnvioRequest {
  receptorId?: number
  nombreReceptorExterno: string
  direccionEntrega: string
  zonaOrigen: string
  zonaDestino: string
  pesoKg: number
  dimensiones?: string
}

export interface HistorialEstado {
  historialId: number
  envioId: number
  estadoId: number
  estadoNombre: string
  usuarioModificoNombre: string
  comentario?: string
  ubicacionActual?: string
  fechaCambio: string
}

// Forma real que devuelve EnviosController (EnvioDetalleDto)
export interface EnvioDetalle {
  envioId: number
  codigoRastreo: string
  remitente: string
  repartidor?: string
  receptor: string
  direccionOrigen: string
  direccionDestino: string
  descripcionPaquete: string
  pesoKg: number
  distanciaKm: number
  costoTotal: number
  estadoActualId: number
  estadoActual: string
  fechaCreacion: string
}

export interface HistorialRastreo {
  historialId: number
  estado: string
  usuarioCambio: string
  comentario?: string
  fechaCambio: string
}

export interface EnvioRastreo extends EnvioDetalle {
  historial: HistorialRastreo[]
}

// POST api/Envios/cotizar (CotizarRequestDto / CotizarResponseDto)
export interface CotizarRequest {
  pesoKg: number
  distanciaKm: number
}

export interface CotizarResponse {
  nombreTarifa: string
  pesoKg: number
  distanciaKm: number
  precioBase: number
  precioPorKm: number
  costoTotal: number
}

// POST api/Envios (CrearEnvioRequestDto)
export interface NuevoEnvioRequest {
  correoReceptor: string
  direccionOrigen: string
  direccionDestino: string
  descripcionPaquete: string
  pesoKg: number
  distanciaKm: number
}
