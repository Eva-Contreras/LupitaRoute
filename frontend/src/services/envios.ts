import type {
  CotizarRequest,
  CotizarResponse,
  EnvioDetalle,
  EstadoPaquete,
  NuevoEnvioRequest,
} from '../types/lupita.types'

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

// GET api/Envios/mis-envios (Repartidor: envíos asignados al usuario del token)
export async function obtenerMisEnvios(token: string): Promise<EnvioDetalle[]> {
  const payload = await solicitar({ ruta: '/api/Envios/mis-envios', token })
  return lista(payload, leerEnvio)
}

// GET api/Envios/estados (catálogo, sp_ObtenerEstadosPaquete)
export async function obtenerEstados(): Promise<EstadoPaquete[]> {
  const payload = await solicitar({ ruta: '/api/Envios/estados' })
  return lista(payload, leerEstado)
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
