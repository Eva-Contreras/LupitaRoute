import { useState } from 'react'
import { DetalleEnvio } from '../DetalleEnvio'
import { FiltrosEnvios } from '../FiltrosEnvios'
import { PaginacionEnvios } from '../PaginacionEnvios'
import { ResumenEnvios } from '../ResumenEnvios'
import { filtrarPorFecha } from '../filtrarPorFecha'
import { TablaEnvios } from '../TablaEnvios'
import type { ControlesLista } from '../controlesLista'
import type { EnvioDetalle, EstadoPaquete } from '../../types/envio.types'

interface MisPaquetesProps {
  token: string
  envios: EnvioDetalle[]
  estados: EstadoPaquete[]
  controles: ControlesLista
  actualizacion: number
  onSesionExpirada: () => void
  onActualizar: (envio: EnvioDetalle) => void
  onRecargar: () => void
}

export function MisPaquetes({ token, envios, estados, controles, actualizacion, onSesionExpirada, onActualizar, onRecargar }: MisPaquetesProps) {
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)

  if (seleccionado) {
    return (
      <DetalleEnvio
        token={token}
        envio={seleccionado}
        mostrarRemitente
        textoVolver="Volver a mis paquetes"
        onVolver={(actualizado) => {
          if (actualizado) onActualizar(actualizado)
          setSeleccionado(null)
        }}
      />
    )
  }

  const filtrados = filtrarPorFecha(envios, fechaDesde, fechaHasta)
  const sinFiltros = controles.busqueda.trim() === '' && controles.estadoId === ''

  return (
    <section className="sender-shipments" aria-labelledby="packages-title">
      <header className="sender-section-header">
        <div>
          <h2 id="packages-title">Mis paquetes</h2>
          <p>Consulta los envíos dirigidos a ti y selecciona un código para ver el detalle.</p>
        </div>
        <button className="shipment-action" type="button" onClick={onRecargar}>
          Actualizar lista
        </button>
      </header>
      <ResumenEnvios key={actualizacion} token={token} rol="Receptor" actualizacion={actualizacion} onSesionExpirada={onSesionExpirada} />
      <FiltrosEnvios
        etiqueta="Filtros de paquetes"
        estados={estados}
        busqueda={controles.busqueda}
        estado={controles.estadoId}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        placeholderBusqueda="Código o remitente"
        onCambiarBusqueda={controles.onCambiarBusqueda}
        onCambiarEstado={controles.onCambiarEstado}
        onCambiarFechaDesde={setFechaDesde}
        onCambiarFechaHasta={setFechaHasta}
      />
      {envios.length === 0 && sinFiltros && !controles.actualizando ? (
        <p className="shipment-empty">Aún no tienes paquetes asociados a tu cuenta.</p>
      ) : (
        <TablaEnvios vista="receptor" envios={filtrados} onSeleccionar={setSeleccionado} />
      )}
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
