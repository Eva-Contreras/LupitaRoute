import type { AuthResponse, RolNombre, Usuario } from '../types/lupita.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return true
}

function isRolNombre(value: unknown): value is RolNombre {
  return value === 'Remitente' || value === 'Repartidor' || value === 'Receptor'
}

function parseAuthResponse(value: unknown): AuthResponse | null {
  if (!isRecord(value) || typeof value.token !== 'string' || !isRecord(value.usuario)) {
    return null
  }

  const responseUsuario = value.usuario
  if (
    typeof responseUsuario.usuarioId !== 'number' ||
    typeof responseUsuario.nombreCompleto !== 'string' ||
    typeof responseUsuario.correo !== 'string' ||
    (responseUsuario.telefono !== undefined &&
      responseUsuario.telefono !== null &&
      typeof responseUsuario.telefono !== 'string') ||
    typeof responseUsuario.rolId !== 'number' ||
    !isRolNombre(responseUsuario.rol)
  ) {
    return null
  }

  const usuario: Usuario = {
    usuarioId: responseUsuario.usuarioId,
    nombreCompleto: responseUsuario.nombreCompleto,
    correo: responseUsuario.correo,
    ...(typeof responseUsuario.telefono === 'string'
      ? { telefono: responseUsuario.telefono }
      : {}),
    rolId: responseUsuario.rolId,
    rol: responseUsuario.rol,
  }

  return { token: value.token, usuario }
}

export async function login(correo: string, password: string): Promise<AuthResponse> {
  const apiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL para conectar con la API.')
  }

  let response: Response
  try {
    response = await fetch(`${apiUrl}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    })
  } catch {
    throw new Error('No se pudo conectar con la API. Verifica que esté disponible.')
  }

  if (response.status === 401) {
    throw new Error('Correo o contraseña incorrectos.')
  }

  if (!response.ok) {
    throw new Error(`No fue posible iniciar sesión (HTTP ${response.status}).`)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new Error('La API devolvió una respuesta no válida.')
  }

  const authResponse = parseAuthResponse(payload)
  if (!authResponse) {
    throw new Error('La API devolvió datos de sesión incompletos.')
  }

  return authResponse
}
