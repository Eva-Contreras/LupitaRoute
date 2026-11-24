import { useState } from 'react'
import { FiltrosEnvios } from '../FiltrosEnvios'
import { TablaEnvios } from '../TablaEnvios'
import { DetalleEnvio } from '../DetalleEnvio'
import { filtrarEnvios } from '../filtrarEnvios'
import type { EnvioDetalle, EstadoPaquete } from '../../types/envio.types'

interface MisEnviosProps {
  envios: EnvioDetalle[]
  estados: EstadoPaquete[]
  onActualizar: (envio: EnvioDetalle) => void
}

export function MisEnvios({ envios, estados, onActualizar }: MisEnviosProps) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)

  if (seleccionado) {
    return (
      <DetalleEnvio
        envio={seleccionado}
        onVolver={(actualizado) => {
          if (actualizado) onActualizar(actualizado)
          setSeleccionado(null)
        }}
      />
    )
  }

  const enviosFiltrados = filtrarEnvios(envios, { busqueda, estado, fechaDesde, fechaHasta })

  return (
    <section className="sender-shipments" aria-labelledby="shipments-title">
      <header className="sender-section-header">
        <div>
          <h2 id="shipments-title">Mis envíos</h2>
          <p>Consulta tus paquetes y selecciona un código para ver el detalle.</p>
        </div>
      </header>

      <FiltrosEnvios
        etiqueta="Filtros de envíos"
        estados={estados}
        busqueda={busqueda}
        estado={estado}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onCambiarBusqueda={setBusqueda}
        onCambiarEstado={setEstado}
        onCambiarFechaDesde={setFechaDesde}
        onCambiarFechaHasta={setFechaHasta}
      />
      <TablaEnvios vista="remitente" envios={enviosFiltrados} onSeleccionar={setSeleccionado} />
    </section>
  )
}
