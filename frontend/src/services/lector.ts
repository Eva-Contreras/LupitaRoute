import { ErrorApi, esRegistro, type Registro } from './http'

// El backend serializa en camelCase; se acepta también PascalCase porque algunos
// resultados (catálogo de estados) pueden llegar sin normalizar.
function campo(registro: Registro, nombre: string): unknown {
  if (nombre in registro) {
    return registro[nombre]
  }
  return registro[nombre.charAt(0).toUpperCase() + nombre.slice(1)]
}

export interface Lector {
  texto: (nombre: string) => string
  textoOpcional: (nombre: string) => string | undefined
  numero: (nombre: string) => number
  cantidad: (nombre: string) => number
  lista: (nombre: string) => unknown[]
  fallar: (nombre?: string) => never
}

// Lee un objeto del backend y lanza ErrorApi si no cumple el contrato, en lugar
// de rellenar valores por defecto que ocultarían un cambio en la API.
// `descripcion` lleva su artículo (p. ej. "un envío") para formar el mensaje.
export function leer(valor: unknown, descripcion: string): Lector {
  const fallar = (nombre?: string): never => {
    const detalle = nombre ? ` (campo «${nombre}»)` : ''
    throw new ErrorApi(`La API devolvió ${descripcion} no válido${detalle}.`)
  }
  if (!esRegistro(valor)) {
    return fallar()
  }

  return {
    fallar,
    texto(nombre) {
      const dato = campo(valor, nombre)
      return typeof dato === 'string' ? dato : fallar(nombre)
    },
    textoOpcional(nombre) {
      const dato = campo(valor, nombre)
      if (dato === null || dato === undefined) {
        return undefined
      }
      return typeof dato === 'string' ? dato : fallar(nombre)
    },
    numero(nombre) {
      const dato = campo(valor, nombre)
      return typeof dato === 'number' && Number.isFinite(dato) ? dato : fallar(nombre)
    },
    cantidad(nombre) {
      const dato = campo(valor, nombre)
      return typeof dato === 'number' && Number.isInteger(dato) && dato >= 0
        ? dato
        : fallar(nombre)
    },
    lista(nombre) {
      const dato = campo(valor, nombre)
      return Array.isArray(dato) ? dato : fallar(nombre)
    },
  }
}

export function leerLista<T>(
  payload: unknown,
  descripcion: string,
  leerItem: (item: unknown) => T,
): T[] {
  if (!Array.isArray(payload)) {
    throw new ErrorApi(`La API devolvió una lista de ${descripcion} no válida.`)
  }
  return payload.map(leerItem)
}
