import { useState } from 'react'
import { FiltrosEnvios } from '../FiltrosEnvios'
import { TablaEnvios } from '../TablaEnvios'
import { DetalleEnvio } from '../DetalleEnvio'
import { PaginacionEnvios } from '../PaginacionEnvios'
import { ResumenEnvios } from '../ResumenEnvios'
import { filtrarPorFecha } from '../filtrarPorFecha'
import type { ControlesLista } from '../controlesLista'
import type { EnvioDetalle, EstadoPaquete } from '../../types/envio.types'

interface MisEnviosProps {
  token: string
  envios: EnvioDetalle[]
  estados: EstadoPaquete[]
  controles: ControlesLista
  actualizacion: number
  onSesionExpirada: () => void
  onActualizar: (envio: EnvioDetalle) => void
}

export function MisEnvios({ token, envios, estados, controles, actualizacion, onSesionExpirada, onActualizar }: MisEnviosProps) {
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)

  if (seleccionado) {
    return (
      <DetalleEnvio
        token={token}
        envio={seleccionado}
        onVolver={(actualizado) => {
          if (actualizado) onActualizar(actualizado)
          setSeleccionado(null)
        }}
      />
    )
  }

  const enviosFiltrados = filtrarPorFecha(envios, fechaDesde, fechaHasta)

  return (
    <section className="sender-shipments" aria-labelledby="shipments-title">
      <header className="sender-section-header">
        <div>
          <h2 id="shipments-title">Mis envíos</h2>
          <p>Consulta tus paquetes y selecciona un código para ver el detalle.</p>
        </div>
      </header>

      <ResumenEnvios key={actualizacion} token={token} rol="Remitente" actualizacion={actualizacion} onSesionExpirada={onSesionExpirada} />
      <FiltrosEnvios
        etiqueta="Filtros de envíos"
        estados={estados}
        busqueda={controles.busqueda}
        estado={controles.estadoId}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onCambiarBusqueda={controles.onCambiarBusqueda}
        onCambiarEstado={controles.onCambiarEstado}
        onCambiarFechaDesde={setFechaDesde}
        onCambiarFechaHasta={setFechaHasta}
      />
      <TablaEnvios vista="remitente" envios={enviosFiltrados} onSeleccionar={setSeleccionado} />
      <PaginacionEnvios
        pagina={controles.pagina}
        totalPaginas={controles.totalPaginas}
        totalRegistros={controles.totalRegistros}
        deshabilitada={controles.actualizando}
        onCambiar={controles.onCambiarPagina}
      />
    </section>
  )
}
