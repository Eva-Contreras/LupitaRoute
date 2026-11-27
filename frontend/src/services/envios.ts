import type { CotizarRequest, CotizarResponse, EnvioDetalle, EnvioRastreo, EnvioRastreoPublico, EstadoPaquete, HistorialPublico, HistorialRastreo, NuevoEnvioRequest, ReceptorVerificado, ResumenEnvios, TarifaItem } from '../types/envio.types'
import { solicitar } from './http'
import { leer, leerLista } from './lector'

export { ErrorApi } from './http'

function leerEstado(value: unknown): EstadoPaquete {
  const lector = leer(value, 'un estado')
  return {
    estadoId: lector.numero('estadoId'),
    nombre: lector.texto('nombre'),
    descripcion: lector.textoOpcional('descripcion') ?? '',
  }
}

function leerTarifa(value: unknown): TarifaItem {
  const lector = leer(value, 'una tarifa')
  return {
    tarifaId: lector.numero('tarifaId'),
    nombreTarifa: lector.texto('nombreTarifa'),
    pesoMinKg: lector.numero('pesoMinKg'),
    pesoMaxKg: lector.numero('pesoMaxKg'),
    precioBase: lector.numero('precioBase'),
    precioPorKm: lector.numero('precioPorKm'),
  }
}

function leerReceptorVerificado(value: unknown): ReceptorVerificado {
  const lector = leer(value, 'un receptor')
  return {
    usuarioId: lector.numero('usuarioId'),
    nombreCompleto: lector.texto('nombreCompleto'),
    correo: lector.texto('correo'),
    rol: lector.texto('rol'),
  }
}

function leerEnvio(value: unknown): EnvioDetalle {
  const lector = leer(value, 'un envío')
  const repartidor = lector.textoOpcional('repartidor')
  return {
    envioId: lector.numero('envioId'),
    codigoRastreo: lector.texto('codigoRastreo'),
    remitente: lector.texto('remitente'),
    ...(repartidor ? { repartidor } : {}),
    receptor: lector.texto('receptor'),
    direccionOrigen: lector.texto('direccionOrigen'),
    direccionDestino: lector.texto('direccionDestino'),
    descripcionPaquete: lector.texto('descripcionPaquete'),
    pesoKg: lector.numero('pesoKg'),
    distanciaKm: lector.numero('distanciaKm'),
    costoTotal: lector.numero('costoTotal'),
    estadoActualId: lector.numero('estadoActualId'),
    estadoActual: lector.texto('estadoActual'),
    fechaCreacion: lector.texto('fechaCreacion'),
  }
}

function leerCotizacion(value: unknown): CotizarResponse {
  const lector = leer(value, 'una cotización')
  return {
    nombreTarifa: lector.texto('nombreTarifa'),
    pesoKg: lector.numero('pesoKg'),
    distanciaKm: lector.numero('distanciaKm'),
    precioBase: lector.numero('precioBase'),
    precioPorKm: lector.numero('precioPorKm'),
    costoTotal: lector.numero('costoTotal'),
  }
}

function leerMovimientoPublico(value: unknown): HistorialPublico {
  const lector = leer(value, 'un movimiento')
  const comentario = lector.textoOpcional('comentario')
  return {
    estado: lector.texto('estado'),
    ...(comentario ? { comentario } : {}),
    fechaCambio: lector.texto('fechaCambio'),
  }
}

function leerMovimiento(value: unknown): HistorialRastreo {
  const lector = leer(value, 'un movimiento')
  const comentario = lector.textoOpcional('comentario')
  return {
    historialId: lector.numero('historialId'),
    estado: lector.texto('estado'),
    usuarioCambio: lector.texto('usuarioCambio'),
    ...(comentario ? { comentario } : {}),
    fechaCambio: lector.texto('fechaCambio'),
  }
}

export const TAMANO_PAGINA = 10

export interface ConsultaEnvios {
  estadoId?: number
  busqueda?: string
  pagina?: number
  tamanoPagina?: number
}

export interface PaginaEnvios {
  items: EnvioDetalle[]
  totalRegistros: number
  paginaActual: number
  totalPaginas: number
}

// GET api/Envios/mis-envios (EnviosPaginadosDto). Admite estadoId, busqueda,
// pagina y tamanoPagina (1-50); el backend filtra según el rol del token.
export async function consultarMisEnvios(
  token: string,
  { estadoId, busqueda, pagina = 1, tamanoPagina = TAMANO_PAGINA }: ConsultaEnvios = {},
): Promise<PaginaEnvios> {
  const parametros = new URLSearchParams({
    pagina: String(pagina),
    tamanoPagina: String(tamanoPagina),
  })
  if (estadoId !== undefined) {
    parametros.set('estadoId', String(estadoId))
  }
  const termino = busqueda?.trim()
  if (termino) {
    parametros.set('busqueda', termino)
  }

  const payload = await solicitar({
    ruta: `/api/Envios/mis-envios?${parametros.toString()}`,
    token,
  })
  const lector = leer(payload, 'una página de envíos')
  return {
    items: lector.lista('items').map(leerEnvio),
    totalRegistros: lector.cantidad('totalRegistros'),
    paginaActual: lector.cantidad('paginaActual'),
    totalPaginas: lector.cantidad('totalPaginas'),
  }
}

// GET api/Envios/resumen
export async function obtenerResumen(token: string): Promise<ResumenEnvios> {
  const payload = await solicitar({ ruta: '/api/Envios/resumen', token })
  const lector = leer(payload, 'un resumen')

  return {
    rol: lector.texto('rol'),
    totalEnvios: lector.cantidad('totalEnvios'),
    enviosActivos: lector.cantidad('enviosActivos'),
    enviosEntregados: lector.cantidad('enviosEntregados'),
    enviosCancelados: lector.cantidad('enviosCancelados'),
    enviosConIncidencia: lector.cantidad('enviosConIncidencia'),
    montoTotalOperado: lector.numero('montoTotalOperado'),
    montoEntregado: lector.numero('montoEntregado'),
    desglosePorEstado: lector.lista('desglosePorEstado').map((item) => {
      const desglose = leer(item, 'un resumen')
      return {
        estadoId: desglose.cantidad('estadoId'),
        estado: desglose.texto('estado'),
        cantidad: desglose.cantidad('cantidad'),
      }
    }),
  }
}

// GET api/Envios/disponibles (solo Repartidor)
export async function obtenerEnviosDisponibles(token: string): Promise<EnvioDetalle[]> {
  const payload = await solicitar({ ruta: '/api/Envios/disponibles', token })
  return leerLista(payload, 'envíos disponibles', leerEnvio)
}

// GET api/Envios/estados (catálogo, sp_ObtenerEstadosPaquete)
export async function obtenerEstados(): Promise<EstadoPaquete[]> {
  const payload = await solicitar({ ruta: '/api/Envios/estados' })
  return leerLista(payload, 'estados', leerEstado)
}

// GET api/Envios/tarifas
export async function obtenerTarifas(): Promise<TarifaItem[]> {
  const payload = await solicitar({ ruta: '/api/Envios/tarifas' })
  return leerLista(payload, 'tarifas', leerTarifa)
}

// GET api/Envios/verificar-receptor (solo Remitente)
export async function verificarReceptor(
  token: string,
  correo: string,
): Promise<ReceptorVerificado> {
  const parametros = new URLSearchParams({ correo: correo.trim() })
  const payload = await solicitar({
    ruta: `/api/Envios/verificar-receptor?${parametros.toString()}`,
    token,
  })
  return leerReceptorVerificado(payload)
}

// GET api/Envios/rastreo/publico/{codigo} (sin sesión, datos limitados)
export async function rastrearEnvioPublico(codigo: string): Promise<EnvioRastreoPublico> {
  const payload = await solicitar({
    ruta: `/api/Envios/rastreo/publico/${encodeURIComponent(codigo)}`,
  })
  const lector = leer(payload, 'un envío')
  return {
    codigoRastreo: lector.texto('codigoRastreo'),
    estadoActualId: lector.numero('estadoActualId'),
    estadoActual: lector.texto('estadoActual'),
    fechaCreacion: lector.texto('fechaCreacion'),
    historial: lector.lista('historial').map(leerMovimientoPublico),
  }
}

// GET api/Envios/rastreo/{codigo} (requiere sesión y ser parte del envío)
export async function rastrearEnvio(token: string, codigo: string): Promise<EnvioRastreo> {
  const payload = await solicitar({
    ruta: `/api/Envios/rastreo/${encodeURIComponent(codigo)}`,
    token,
  })
  return {
    ...leerEnvio(payload),
    historial: leer(payload, 'un envío').lista('historial').map(leerMovimiento),
  }
}

// PUT api/Envios/{envioId}/estado (sp_ActualizarEstadoEnvio)
export async function actualizarEstado(
  token: string,
  envioId: number,
  nuevoEstadoId: number,
  comentario: string | null,
): Promise<void> {
  await solicitar({
    ruta: `/api/Envios/${envioId}/estado`,
    metodo: 'PUT',
    token,
    cuerpo: { nuevoEstadoId, comentario },
  })
}

// PUT api/Envios/{envioId}/asignar (solo Repartidor)
export async function asignarEnvio(token: string, envioId: number): Promise<EnvioDetalle> {
  const payload = await solicitar({
    ruta: `/api/Envios/${envioId}/asignar`,
    metodo: 'PUT',
    token,
  })
  return leerEnvio(payload)
}

// El backend exige que el envío esté asignado al repartidor antes de cambiar su estado.
export async function asignarYRegistrarRecoleccion(
  token: string,
  envioId: number,
  estadoRecolectadoId: number,
): Promise<void> {
  await asignarEnvio(token, envioId)
  await actualizarEstado(token, envioId, estadoRecolectadoId, null)
}

// POST api/Envios/cotizar (público)
export async function cotizarEnvio(solicitud: CotizarRequest): Promise<CotizarResponse> {
  const payload = await solicitar({
    ruta: '/api/Envios/cotizar',
    metodo: 'POST',
    cuerpo: solicitud,
  })
  return leerCotizacion(payload)
}

// POST api/Envios (solo Remitente)
export async function crearEnvio(
  token: string,
  solicitud: NuevoEnvioRequest,
): Promise<EnvioDetalle> {
  const payload = await solicitar({
    ruta: '/api/Envios',
    metodo: 'POST',
    token,
    cuerpo: solicitud,
  })
  return leerEnvio(payload)
}
