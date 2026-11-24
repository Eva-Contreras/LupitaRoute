import type { EnvioDetalle, EstadoPaquete } from '../types/lupita.types'

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

function lista<T>(payload: unknown, leer: (item: unknown) => T | null): T[] {
  if (!Array.isArray(payload)) {
    throw new ErrorApi('La API devolvió una respuesta no válida.')
  }
  return payload.flatMap((item) => {
    const leido = leer(item)
    return leido ? [leido] : []
  })
}

interface Solicitud {
  ruta: string
  metodo?: 'GET' | 'PUT'
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
    const mensaje = esRegistro(payload) ? texto(payload.mensaje) : ''
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
