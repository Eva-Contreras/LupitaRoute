import { useEffect, useState } from 'react'
import {
  crearEnvio,
  ErrorApi,
  obtenerEstados,
  obtenerMisEnvios,
} from '../services/envios'
import type { EnvioDetalle, EstadoPaquete, NuevoEnvioRequest } from '../types/envio.types'

export interface ErrorVista {
  mensaje: string
  sesionExpirada: boolean
}

function aErrorVista(error: unknown): ErrorVista {
  if (error instanceof ErrorApi) {
    return { mensaje: error.message, sesionExpirada: error.estado === 401 }
  }
  return { mensaje: 'Ocurrió un error inesperado.', sesionExpirada: false }
}

export function useEnvios(token: string) {
  const [envios, setEnvios] = useState<EnvioDetalle[]>([])
  const [estados, setEstados] = useState<EstadoPaquete[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<ErrorVista | null>(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true

    Promise.all([obtenerMisEnvios(token), obtenerEstados()])
      .then(([enviosApi, estadosApi]) => {
        if (!vigente) return
        setEnvios(enviosApi)
        setEstados(estadosApi)
        setError(null)
      })
      .catch((caughtError: unknown) => {
        if (vigente) setError(aErrorVista(caughtError))
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [token, intento])

  function reintentar() {
    setCargando(true)
    setError(null)
    setIntento((actual) => actual + 1)
  }

  async function crear(solicitud: NuevoEnvioRequest): Promise<EnvioDetalle> {
    const envio = await crearEnvio(token, solicitud)
    setEnvios((actuales) => [
      envio,
      ...actuales.filter((actual) => actual.envioId !== envio.envioId),
    ])
    return envio
  }

  function actualizarEnLista(envio: EnvioDetalle) {
    setEnvios((actuales) =>
      actuales.map((actual) => actual.envioId === envio.envioId ? envio : actual),
    )
  }

  return { envios, estados, cargando, error, reintentar, crear, actualizarEnLista }
}
