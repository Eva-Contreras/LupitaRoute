import { useEffect, useState } from 'react'
import { actualizarEstado, consultarMisEnvios } from '../services/envios'
import type { EnvioDetalle } from '../types/envio.types'
import { aErrorVista, useListaEnvios } from './useListaEnvios'

export type { ErrorVista } from './useListaEnvios'

const MAXIMO_SELECTOR = 50

interface Complemento {
  clave: string
  selector: EnvioDetalle[]
}

export function useEntregas(token: string) {
  const lista = useListaEnvios(token)
  const { intento, reintentar } = lista
  const [complemento, setComplemento] = useState<Complemento | null>(null)
  const [falloSelector, setFalloSelector] = useState<{ clave: string; error: ReturnType<typeof aErrorVista> } | null>(null)
  const clave = `${token}|${intento}`

  useEffect(() => {
    let vigente = true
    consultarMisEnvios(token, { tamanoPagina: MAXIMO_SELECTOR })
      .then((pagina) => {
        if (!vigente) return
        setComplemento({ clave, selector: pagina.items })
      })
      .catch((error: unknown) => {
        if (vigente) setFalloSelector({ clave, error: aErrorVista(error) })
      })
    return () => {
      vigente = false
    }
  }, [token, clave])

  async function cambiarEstado(
    envioId: number,
    estadoId: number,
    comentario: string,
  ) {
    await actualizarEstado(token, envioId, estadoId, comentario || null)
    reintentar()
  }

  return {
    ...lista,
    cambiarEstado,
    entregasSelector: complemento?.clave === clave ? complemento.selector : [],
    cargandoSelector: complemento?.clave !== clave && falloSelector?.clave !== clave,
    errorSelector: falloSelector?.clave === clave ? falloSelector.error : null,
  }
}
