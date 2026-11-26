import { crearEnvio } from '../services/envios'
import type { EnvioDetalle, NuevoEnvioRequest } from '../types/envio.types'
import { useListaEnvios } from './useListaEnvios'

export type { ErrorVista } from './useListaEnvios'

export function useEnvios(token: string) {
  const lista = useListaEnvios(token)
  const { reintentar } = lista

  async function crear(solicitud: NuevoEnvioRequest): Promise<EnvioDetalle> {
    const envio = await crearEnvio(token, solicitud)
    reintentar()
    return envio
  }

  return { ...lista, crear }
}
