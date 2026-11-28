export class ErrorApi extends Error {
  readonly estado: number | null

  constructor(mensaje: string, estado: number | null = null) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
  }
}

export type Registro = Record<string, unknown>

export function esRegistro(value: unknown): value is Registro {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// El backend responde { mensaje } en los errores de negocio y, cuando falla una
// validación de [Range]/[Required], un objeto { errors: { Campo: [mensajes] } }.
function mensajeDeError(payload: unknown): string {
  if (!esRegistro(payload)) {
    return ''
  }
  if (typeof payload.mensaje === 'string' && payload.mensaje) {
    return payload.mensaje
  }
  if (esRegistro(payload.errors)) {
    for (const valor of Object.values(payload.errors)) {
      if (Array.isArray(valor)) {
        const primero = valor.find((item) => typeof item === 'string' && item)
        if (typeof primero === 'string') {
          return primero
        }
      }
    }
  }
  return ''
}

export interface Solicitud {
  ruta: string
  metodo?: 'GET' | 'POST' | 'PUT'
  token?: string
  cuerpo?: unknown
  // Mensaje para un 401 cuando no significa "sesión expirada" (p. ej. credenciales inválidas).
  mensajeNoAutorizado?: string
  // Mensaje cuando el backend falla sin explicar el motivo.
  mensajeFallo?: (estado: number) => string
}

// Cliente único para la API: resuelve la URL base, adjunta el token y traduce
// los errores HTTP a ErrorApi con un mensaje apto para mostrar.
export async function solicitar({
  ruta,
  metodo = 'GET',
  token,
  cuerpo,
  mensajeNoAutorizado = 'Tu sesión expiró. Vuelve a iniciar sesión.',
  mensajeFallo = (estado) => `La API respondió con un error (HTTP ${estado}).`,
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
    throw new ErrorApi(mensajeNoAutorizado, 401)
  }
  if (response.status === 403) {
    throw new ErrorApi('Tu usuario no tiene permiso para esta acción.', 403)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    payload = undefined
  }

  if (!response.ok) {
    throw new ErrorApi(mensajeDeError(payload) || mensajeFallo(response.status), response.status)
  }
  if (payload === undefined) {
    throw new ErrorApi('La API devolvió una respuesta no válida.', response.status)
  }

  return payload
}
