import { useEffect, useState } from 'react'
import { consultarMisEnvios, ErrorApi, obtenerEstados } from '../services/envios'
import type { ControlesLista } from '../components/controlesLista'
import type { EnvioDetalle, EstadoPaquete } from '../types/envio.types'

export interface ErrorVista {
  mensaje: string
  sesionExpirada: boolean
}

export function aErrorVista(error: unknown): ErrorVista {
  if (error instanceof ErrorApi) {
    return { mensaje: error.message, sesionExpirada: error.estado === 401 }
  }
  return { mensaje: 'Ocurrió un error inesperado.', sesionExpirada: false }
}

interface Consulta {
  busqueda: string
  estadoId: string
  pagina: number
}

interface Resultado {
  clave: string
  envios: EnvioDetalle[]
  totalRegistros: number
  totalPaginas: number
}

interface Fallo {
  clave: string
  error: ErrorVista
}

const RETARDO_BUSQUEDA_MS = 350

// Lista de envíos del usuario con filtros y paginación resueltos por el backend.
export function useListaEnvios(token: string) {
  const [busquedaEscrita, setBusquedaEscrita] = useState('')
  const [consulta, setConsulta] = useState<Consulta>({ busqueda: '', estadoId: '', pagina: 1 })
  const [intento, setIntento] = useState(0)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [fallo, setFallo] = useState<Fallo | null>(null)
  const [catalogo, setCatalogo] = useState<{ clave: string; datos: EstadoPaquete[] } | null>(null)
  const [falloCatalogo, setFalloCatalogo] = useState<Fallo | null>(null)

  const { busqueda, estadoId, pagina } = consulta
  const claveLista = `${token}|${intento}|${estadoId}|${busqueda}|${pagina}`
  const claveCatalogo = `${token}|${intento}`

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setConsulta((actual) =>
        actual.busqueda === busquedaEscrita
          ? actual
          : { ...actual, busqueda: busquedaEscrita, pagina: 1 },
      )
    }, RETARDO_BUSQUEDA_MS)
    return () => clearTimeout(temporizador)
  }, [busquedaEscrita])

  useEffect(() => {
    let vigente = true
    consultarMisEnvios(token, {
      ...(estadoId !== '' ? { estadoId: Number(estadoId) } : {}),
      busqueda,
      pagina,
    })
      .then((respuesta) => {
        if (!vigente) return
        setResultado({
          clave: claveLista,
          envios: respuesta.items,
          totalRegistros: respuesta.totalRegistros,
          totalPaginas: respuesta.totalPaginas,
        })
      })
      .catch((caughtError: unknown) => {
        if (vigente) setFallo({ clave: claveLista, error: aErrorVista(caughtError) })
      })
    return () => {
      vigente = false
    }
  }, [token, estadoId, busqueda, pagina, claveLista])

  useEffect(() => {
    let vigente = true
    obtenerEstados()
      .then((datos) => {
        if (vigente) setCatalogo({ clave: claveCatalogo, datos })
      })
      .catch((caughtError: unknown) => {
        if (vigente) setFalloCatalogo({ clave: claveCatalogo, error: aErrorVista(caughtError) })
      })
    return () => {
      vigente = false
    }
  }, [claveCatalogo])

  const errorLista = fallo?.clave === claveLista ? fallo.error : null
  const errorCatalogo = falloCatalogo?.clave === claveCatalogo ? falloCatalogo.error : null
  const error = errorLista ?? errorCatalogo
  const actualizando = !error && resultado !== null && resultado.clave !== claveLista

  const controles: ControlesLista = {
    busqueda: busquedaEscrita,
    estadoId,
    pagina,
    totalPaginas: resultado?.totalPaginas ?? 0,
    totalRegistros: resultado?.totalRegistros ?? 0,
    actualizando,
    onCambiarBusqueda: setBusquedaEscrita,
    onCambiarEstado: (valor) =>
      setConsulta((actual) => ({ ...actual, estadoId: valor, pagina: 1 })),
    onCambiarPagina: (valor) => setConsulta((actual) => ({ ...actual, pagina: valor })),
  }

  return {
    envios: resultado?.envios ?? [],
    estados: catalogo?.datos ?? [],
    controles,
    cargando: !error && (resultado === null || catalogo === null),
    error,
    intento,
    reintentar: () => setIntento((actual) => actual + 1),
    actualizarEnLista: (envio: EnvioDetalle) =>
      setResultado((actual) =>
        actual && {
          ...actual,
          envios: actual.envios.map((item) => (item.envioId === envio.envioId ? envio : item)),
        },
      ),
  }
}
