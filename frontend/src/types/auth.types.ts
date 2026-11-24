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
