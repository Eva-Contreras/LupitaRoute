export type RolNombre = 'Remitente' | 'Repartidor' | 'Receptor'

export interface Usuario {
  usuarioId: number
  nombreCompleto: string
  correo: string
  telefono?: string
  rolId: number
  rol: RolNombre
}

export interface AuthResponse {
  token: string
  usuario: Usuario
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
