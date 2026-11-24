import { useEffect, useState } from 'react'
import {
  actualizarEstado,
  ErrorApi,
  obtenerEstados,
  obtenerMisEnvios,
} from '../../services/envios'
import type { EnvioDetalle, EstadoPaquete } from '../../types/lupita.types'

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

export function useEntregas(token: string) {
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

  async function cambiarEstado(
    envioId: number,
    estadoId: number,
    comentario: string,
  ) {
    await actualizarEstado(token, envioId, estadoId, comentario || null)
    const nombre =
      estados.find((estado) => estado.estadoId === estadoId)?.nombre ?? ''
    setEnvios((actuales) =>
      actuales.map((envio) =>
        envio.envioId === envioId
          ? { ...envio, estadoActualId: estadoId, estadoActual: nombre }
          : envio,
      ),
    )
  }

  return { envios, estados, cargando, error, reintentar, cambiarEstado }
}
