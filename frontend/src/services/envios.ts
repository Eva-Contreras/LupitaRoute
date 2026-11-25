import type { CotizarRequest, CotizarResponse, EnvioDetalle, EnvioRastreo, EnvioRastreoPublico, EstadoPaquete, HistorialPublico, HistorialRastreo, NuevoEnvioRequest, ResumenEnvios } from '../types/envio.types'

export class ErrorApi extends Error {
  readonly estado: number | null

  constructor(mensaje: string, estado: number | null = null) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
  }
}

type Registro = Record<string, unknown>

function esRegistro(value: unknown): value is Registro {
  return typeof value === 'object' && value !== null
}

// El backend devuelve camelCase en los DTOs y PascalCase en los `dynamic`
// (catálogo de estados), así que se acepta cualquiera de los dos.
function campo(registro: Registro, nombre: string): unknown {
  if (nombre in registro) {
    return registro[nombre]
  }
  return registro[nombre.charAt(0).toUpperCase() + nombre.slice(1)]
}

function texto(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function numero(value: unknown): number {
  const convertido = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(convertido) ? convertido : 0
}

function leerEstado(value: unknown): EstadoPaquete | null {
  if (!esRegistro(value)) {
    return null
  }
  const estadoId = campo(value, 'estadoId')
  const nombre = campo(value, 'nombre')
  if (typeof estadoId !== 'number' || typeof nombre !== 'string') {
    return null
  }
  return {
    estadoId,
    nombre,
    descripcion: texto(campo(value, 'descripcion')),
  }
}

function leerEnvio(value: unknown): EnvioDetalle | null {
  if (!esRegistro(value)) {
    return null
  }
  const envioId = campo(value, 'envioId')
  const codigoRastreo = campo(value, 'codigoRastreo')
  if (typeof envioId !== 'number' || typeof codigoRastreo !== 'string') {
    return null
  }
  const repartidor = texto(campo(value, 'repartidor'))
  return {
    envioId,
    codigoRastreo,
    remitente: texto(campo(value, 'remitente')),
    ...(repartidor ? { repartidor } : {}),
    receptor: texto(campo(value, 'receptor')),
    direccionOrigen: texto(campo(value, 'direccionOrigen')),
    direccionDestino: texto(campo(value, 'direccionDestino')),
    descripcionPaquete: texto(campo(value, 'descripcionPaquete')),
    pesoKg: numero(campo(value, 'pesoKg')),
    distanciaKm: numero(campo(value, 'distanciaKm')),
    costoTotal: numero(campo(value, 'costoTotal')),
    estadoActualId: numero(campo(value, 'estadoActualId')),
    estadoActual: texto(campo(value, 'estadoActual')),
    fechaCreacion: texto(campo(value, 'fechaCreacion')),
  }
}

function leerCotizacion(value: unknown): CotizarResponse | null {
  if (!esRegistro(value)) {
    return null
  }
  const costoTotal = campo(value, 'costoTotal')
  if (typeof costoTotal !== 'number') {
    return null
  }
  return {
    nombreTarifa: texto(campo(value, 'nombreTarifa')),
    pesoKg: numero(campo(value, 'pesoKg')),
    distanciaKm: numero(campo(value, 'distanciaKm')),
    precioBase: numero(campo(value, 'precioBase')),
    precioPorKm: numero(campo(value, 'precioPorKm')),
    costoTotal,
  }
}

function lista<T>(payload: unknown, leer: (item: unknown) => T | null): T[] {
  if (!Array.isArray(payload)) {
    throw new ErrorApi('La API devolvió una respuesta no válida.')
  }
  return payload.flatMap((item) => {
    const leido = leer(item)
    return leido ? [leido] : []
  })
}

// El backend responde { mensaje } en los errores de negocio y, cuando falla una
// validación de [Range]/[Required], un objeto { errors: { Campo: [mensajes] } }.
function mensajeDeError(payload: unknown): string {
  if (!esRegistro(payload)) {
    return ''
  }
  const mensaje = texto(payload.mensaje)
  if (mensaje) {
    return mensaje
  }
  if (esRegistro(payload.errors)) {
    for (const valor of Object.values(payload.errors)) {
      if (Array.isArray(valor)) {
        const primero = valor.find((item) => typeof item === 'string')
        if (typeof primero === 'string') {
          return primero
        }
      }
    }
  }
  return ''
}

interface Solicitud {
  ruta: string
  metodo?: 'GET' | 'POST' | 'PUT'
  token?: string
  cuerpo?: unknown
}

async function solicitar({
  ruta,
  metodo = 'GET',
  token,
  cuerpo,
}: Solicitud): Promise<unknown> {
  const apiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
  if (!apiUrl) {
    throw new ErrorApi('Falta configurar VITE_API_URL para conectar con la API.')
  }

  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (cuerpo !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  let response: Response
  try {
    response = await fetch(`${apiUrl}${ruta}`, {
      method: metodo,
      headers,
      ...(cuerpo !== undefined ? { body: JSON.stringify(cuerpo) } : {}),
    })
  } catch {
    throw new ErrorApi('No se pudo conectar con la API. Verifica que esté disponible.')
  }

  if (response.status === 401) {
    throw new ErrorApi('Tu sesión expiró. Vuelve a iniciar sesión.', 401)
  }
  if (response.status === 403) {
    throw new ErrorApi('Tu usuario no tiene permiso para esta acción.', 403)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const mensaje = mensajeDeError(payload)
    throw new ErrorApi(
      mensaje || `La API respondió con un error (HTTP ${response.status}).`,
      response.status,
    )
  }

  return payload
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
  if (!esRegistro(payload)) {
    throw new ErrorApi('La API devolvió una respuesta no válida.')
  }
  return {
    items: lista(campo(payload, 'items'), leerEnvio),
    totalRegistros: numero(campo(payload, 'totalRegistros')),
    paginaActual: numero(campo(payload, 'paginaActual')),
    totalPaginas: numero(campo(payload, 'totalPaginas')),
  }
}

export async function obtenerResumen(token: string): Promise<ResumenEnvios> {
  const payload = await solicitar({ ruta: '/api/Envios/resumen', token })
  if (!esRegistro(payload)) {
    throw new ErrorApi('La API devolvió un resumen no válido.')
  }

  const rol = campo(payload, 'rol')
  const totalEnvios = campo(payload, 'totalEnvios')
  const enviosActivos = campo(payload, 'enviosActivos')
  const enviosEntregados = campo(payload, 'enviosEntregados')
  const enviosCancelados = campo(payload, 'enviosCancelados')
  const enviosConIncidencia = campo(payload, 'enviosConIncidencia')
  const montoTotalOperado = campo(payload, 'montoTotalOperado')
  const montoEntregado = campo(payload, 'montoEntregado')
  const desglose = campo(payload, 'desglosePorEstado')
  const esCantidad = (valor: unknown): valor is number =>
    typeof valor === 'number' && Number.isInteger(valor) && valor >= 0
  const esMonto = (valor: unknown): valor is number =>
    typeof valor === 'number' && Number.isFinite(valor)

  if (typeof rol !== 'string' || !esCantidad(totalEnvios) ||
      !esCantidad(enviosActivos) || !esCantidad(enviosEntregados) ||
      !esCantidad(enviosCancelados) || !esCantidad(enviosConIncidencia) ||
      !esMonto(montoTotalOperado) || !esMonto(montoEntregado) || !Array.isArray(desglose)) {
    throw new ErrorApi('La API devolvió un resumen no válido.')
  }

  const desglosePorEstado = desglose.map((item: unknown) => {
    if (!esRegistro(item)) throw new ErrorApi('La API devolvió un resumen no válido.')
    const estadoId = campo(item, 'estadoId')
    const estado = campo(item, 'estado')
    const cantidad = campo(item, 'cantidad')
    if (!esCantidad(estadoId) || typeof estado !== 'string' || !esCantidad(cantidad)) {
      throw new ErrorApi('La API devolvió un resumen no válido.')
    }
    return { estadoId, estado, cantidad }
  })

  return {
    rol, totalEnvios, enviosActivos, enviosEntregados, enviosCancelados,
    enviosConIncidencia, montoTotalOperado, montoEntregado, desglosePorEstado,
  }
}

export async function obtenerEnviosDisponibles(token: string): Promise<EnvioDetalle[]> {
  const payload = await solicitar({ ruta: '/api/Envios/disponibles', token })
  if (!Array.isArray(payload)) {
    throw new ErrorApi('La API devolvió una lista de envíos disponibles no válida.')
  }
  return payload.map((item: unknown) => {
    const envio = leerEnvio(item)
    if (!envio) {
      throw new ErrorApi('La API devolvió un envío disponible no válido.')
    }
    return envio
  })
}

// GET api/Envios/estados (catálogo, sp_ObtenerEstadosPaquete)
export async function obtenerEstados(): Promise<EstadoPaquete[]> {
  const payload = await solicitar({ ruta: '/api/Envios/estados' })
  return lista(payload, leerEstado)
}

// GET api/Envios/rastreo/publico/{codigo} (sin sesión, datos limitados)
export async function rastrearEnvioPublico(codigo: string): Promise<EnvioRastreoPublico> {
  const payload = await solicitar({
    ruta: `/api/Envios/rastreo/publico/${encodeURIComponent(codigo)}`,
  })
  if (!esRegistro(payload)) {
    throw new ErrorApi('La API devolvió un envío no válido.')
  }
  const codigoRastreo = campo(payload, 'codigoRastreo')
  const historial = campo(payload, 'historial')
  if (typeof codigoRastreo !== 'string' || !Array.isArray(historial)) {
    throw new ErrorApi('La API devolvió un envío no válido.')
  }
  const movimientos: HistorialPublico[] = historial.flatMap((item: unknown) => {
    if (!esRegistro(item)) {
      return []
    }
    const comentario = texto(campo(item, 'comentario'))
    return [{
      estado: texto(campo(item, 'estado')),
      ...(comentario ? { comentario } : {}),
      fechaCambio: texto(campo(item, 'fechaCambio')),
    }]
  })
  return {
    codigoRastreo,
    estadoActualId: numero(campo(payload, 'estadoActualId')),
    estadoActual: texto(campo(payload, 'estadoActual')),
    fechaCreacion: texto(campo(payload, 'fechaCreacion')),
    historial: movimientos,
  }
}

// GET api/Envios/rastreo/{codigo} (requiere sesión y ser parte del envío)
export async function rastrearEnvio(token: string, codigo: string): Promise<EnvioRastreo> {
  const payload = await solicitar({
    ruta: `/api/Envios/rastreo/${encodeURIComponent(codigo)}`,
    token,
  })
  const envio = leerEnvio(payload)
  if (!envio || !esRegistro(payload)) {
    throw new ErrorApi('La API devolvió un envío no válido.')
  }

  const historial = campo(payload, 'historial')
  if (!Array.isArray(historial)) {
    throw new ErrorApi('La API devolvió un historial no válido.')
  }
  const movimientos: HistorialRastreo[] = historial.map((item: unknown) => {
    if (!esRegistro(item)) {
      throw new ErrorApi('La API devolvió un historial no válido.')
    }
    const historialId = campo(item, 'historialId')
    const estado = campo(item, 'estado')
    const usuarioCambio = campo(item, 'usuarioCambio')
    const comentario = campo(item, 'comentario')
    const fechaCambio = campo(item, 'fechaCambio')
    if (
      typeof historialId !== 'number' ||
      typeof estado !== 'string' ||
      typeof usuarioCambio !== 'string' ||
      typeof fechaCambio !== 'string' ||
      (comentario != null && typeof comentario !== 'string')
    ) {
      throw new ErrorApi('La API devolvió un historial no válido.')
    }
    return {
      historialId,
      estado,
      usuarioCambio,
      ...(typeof comentario === 'string' && comentario ? { comentario } : {}),
      fechaCambio,
    }
  })

  return { ...envio, historial: movimientos }
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

// POST api/Envios/cotizar (público)
export async function cotizarEnvio(
  solicitud: CotizarRequest,
): Promise<CotizarResponse> {
  const payload = await solicitar({
    ruta: '/api/Envios/cotizar',
    metodo: 'POST',
    cuerpo: solicitud,
  })
  const cotizacion = leerCotizacion(payload)
  if (!cotizacion) {
    throw new ErrorApi('La API devolvió una cotización no válida.')
  }
  return cotizacion
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
  const envio = leerEnvio(payload)
  if (!envio) {
    throw new ErrorApi('La API devolvió un envío no válido.')
  }
  return envio
}
