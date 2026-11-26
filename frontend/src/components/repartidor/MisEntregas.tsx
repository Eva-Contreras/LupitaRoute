import { useState } from 'react'
import { FiltrosEnvios } from '../FiltrosEnvios'
import { TablaEnvios } from '../TablaEnvios'
import { DetalleEnvio } from '../DetalleEnvio'
import { PaginacionEnvios } from '../PaginacionEnvios'
import { ResumenEnvios } from '../ResumenEnvios'
import { filtrarPorFecha } from '../filtrarPorFecha'
import type { ControlesLista } from '../controlesLista'
import type { EnvioDetalle, EstadoPaquete } from '../../types/envio.types'

interface MisEntregasProps {
  token: string
  entregas: EnvioDetalle[]
  estados: EstadoPaquete[]
  controles: ControlesLista
  actualizacion: number
  onSesionExpirada: () => void
  onActualizar: (envioId: number) => void
  onActualizarLista: (envio: EnvioDetalle) => void
  onRecargar: () => void
  recoleccion: { envioId: number; codigo: string } | null
}

export function MisEntregas({
  token,
  entregas,
  estados,
  controles,
  actualizacion,
  onSesionExpirada,
  onActualizar,
  onActualizarLista,
  onRecargar,
  recoleccion,
}: MisEntregasProps) {
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)

  if (seleccionado) {
    return (
      <DetalleEnvio
        token={token}
        envio={seleccionado}
        textoVolver="Volver a mis entregas"
        onVolver={(actualizado) => {
          if (actualizado) onActualizarLista(actualizado)
          setSeleccionado(null)
        }}
        onActualizar={(actualizado) => {
          if (actualizado) onActualizarLista(actualizado)
          onActualizar(seleccionado.envioId)
        }}
      />
    )
  }

  const entregasFiltradas = filtrarPorFecha(entregas, fechaDesde, fechaHasta)

  return (
    <section className="sender-shipments" aria-labelledby="deliveries-title">
      <header className="sender-section-header">
        <div>
          <h2 id="deliveries-title">Mis entregas</h2>
          <p>Selecciona un código para ver el detalle o actualizar el estado.</p>
        </div>
        <button className="shipment-action" type="button" onClick={onRecargar}>
          Actualizar lista
        </button>
      </header>

      {recoleccion && (
        <p className="courier-notice" role="status">
          La recolección de {recoleccion.codigo} se registró. Si no lo ves en esta página, usa
          la búsqueda por código.
        </p>
      )}

      <ResumenEnvios key={actualizacion} token={token} rol="Repartidor" actualizacion={actualizacion} onSesionExpirada={onSesionExpirada} />

      <FiltrosEnvios
        etiqueta="Filtros de entregas"
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
      <TablaEnvios
        vista="repartidor"
        envios={entregasFiltradas}
        onActualizar={onActualizar}
        onSeleccionar={setSeleccionado}
      />
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
