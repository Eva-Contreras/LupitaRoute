import type { AuthResponse, RolNombre, Usuario } from '../types/auth.types'
import { solicitar } from './http'
import { leer } from './lector'

const ROLES: readonly RolNombre[] = ['Remitente', 'Repartidor', 'Receptor']

function leerUsuario(value: unknown): Usuario {
  const lector = leer(value, 'un usuario')
  const rol = lector.texto('rol')
  const telefono = lector.textoOpcional('telefono')
  const rolValido = ROLES.find((item) => item === rol)
  if (!rolValido) {
    return lector.fallar('rol')
  }

  return {
    usuarioId: lector.numero('usuarioId'),
    nombreCompleto: lector.texto('nombreCompleto'),
    correo: lector.texto('correo'),
    ...(telefono ? { telefono } : {}),
    rolId: lector.numero('rolId'),
    rol: rolValido,
  }
}

export async function login(correo: string, password: string): Promise<AuthResponse> {
  const payload = await solicitar({
    ruta: '/api/Auth/login',
    metodo: 'POST',
    cuerpo: { correo, password },
    mensajeNoAutorizado: 'Correo o contraseña incorrectos.',
    mensajeFallo: (estado) => `No fue posible iniciar sesión (HTTP ${estado}).`,
  })
  const token = leer(payload, 'una sesión').texto('token')

  // El perfil vigente manda sobre los datos que viajaron en el login.
  return { token, usuario: await obtenerPerfil(token) }
}

export async function obtenerPerfil(token: string): Promise<Usuario> {
  const payload = await solicitar({
    ruta: '/api/Auth/me',
    token,
    mensajeFallo: (estado) => `No fue posible consultar el perfil (HTTP ${estado}).`,
  })
  return leerUsuario(payload)
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
  await solicitar({
    ruta: '/api/Auth/register',
    metodo: 'POST',
    cuerpo: { ...datos, rolId: rolesRegistro[rol] },
    mensajeFallo: (estado) => `No fue posible crear la cuenta (HTTP ${estado}).`,
  })
}
