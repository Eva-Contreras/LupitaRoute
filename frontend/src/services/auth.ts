import type { AuthResponse, RolNombre, Usuario } from '../types/auth.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return true
}

function isRolNombre(value: unknown): value is RolNombre {
  return value === 'Remitente' || value === 'Repartidor' || value === 'Receptor'
}

function parseUsuario(value: unknown): Usuario | null {
  if (!isRecord(value)) {
    return null
  }
  const responseUsuario = value
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

  return {
    usuarioId: responseUsuario.usuarioId,
    nombreCompleto: responseUsuario.nombreCompleto,
    correo: responseUsuario.correo,
    ...(typeof responseUsuario.telefono === 'string'
      ? { telefono: responseUsuario.telefono }
      : {}),
    rolId: responseUsuario.rolId,
    rol: responseUsuario.rol,
  }
}

function parseAuthResponse(value: unknown): AuthResponse | null {
  if (!isRecord(value) || typeof value.token !== 'string') {
    return null
  }
  const usuario = parseUsuario(value.usuario)
  if (!usuario) {
    return null
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

  return {
    ...authResponse,
    usuario: await obtenerPerfil(authResponse.token),
  }
}

export async function obtenerPerfil(token: string): Promise<Usuario> {
  const apiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL para conectar con la API.')
  }

  let response: Response
  try {
    response = await fetch(`${apiUrl}/api/Auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error('No se pudo consultar el perfil en la API.')
  }

  if (response.status === 401) {
    throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  }
  if (!response.ok) {
    throw new Error(`No fue posible consultar el perfil (HTTP ${response.status}).`)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new Error('La API devolvió un perfil no válido.')
  }

  const usuario = parseUsuario(payload)
  if (!usuario) {
    throw new Error('La API devolvió datos de perfil incompletos.')
  }
  return usuario
}

interface RegistroUsuario {
  nombreCompleto: string
  correo: string
  password: string
  telefono?: string
}

const rolesRegistro: Record<RolNombre, number> = {
  Remitente: 1,
  Repartidor: 2,
  Receptor: 3,
}

export async function registrarUsuario(datos: RegistroUsuario, rol: RolNombre): Promise<void> {
  const apiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL para conectar con la API.')
  }

  let response: Response
  try {
    response = await fetch(`${apiUrl}/api/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, rolId: rolesRegistro[rol] }),
    })
  } catch {
    throw new Error('No se pudo conectar con la API. Verifica que esté disponible.')
  }

  if (!response.ok) {
    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new Error(`No fue posible crear la cuenta (HTTP ${response.status}).`)
    }

    if (isRecord(payload)) {
      if (typeof payload.mensaje === 'string' && payload.mensaje) {
        throw new Error(payload.mensaje)
      }
      if (isRecord(payload.errors)) {
        for (const mensajes of Object.values(payload.errors)) {
          if (Array.isArray(mensajes)) {
            const mensaje = mensajes.find((valor) => typeof valor === 'string' && valor)
            if (typeof mensaje === 'string') {
              throw new Error(mensaje)
            }
          }
        }
      }
    }
    throw new Error(`No fue posible crear la cuenta (HTTP ${response.status}).`)
  }
}
