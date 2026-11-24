import { useState } from 'react'
import { FiltrosEnvios } from './FiltrosEnvios'
import { TablaEnvios } from './TablaEnvios'
import { DetalleEnvio } from '../shared/DetalleEnvio'
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

  const termino = busqueda.trim().toLocaleLowerCase()
  const enviosFiltrados = envios
    .filter((envio) => {
      const coincideBusqueda =
        termino.length === 0 ||
        envio.codigoRastreo.toLocaleLowerCase().includes(termino) ||
        envio.receptor.toLocaleLowerCase().includes(termino)
      const fechaCreacion = envio.fechaCreacion.slice(0, 10)
      const coincideEstado = estado === '' || envio.estadoActual === estado
      const coincideFechaDesde = fechaDesde === '' || fechaCreacion >= fechaDesde
      const coincideFechaHasta = fechaHasta === '' || fechaCreacion <= fechaHasta

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideFechaDesde &&
        coincideFechaHasta
      )
    })
    .sort(
      (a, b) =>
        (new Date(b.fechaCreacion).getTime() || 0) -
        (new Date(a.fechaCreacion).getTime() || 0),
    )

  return (
    <section className="sender-shipments" aria-labelledby="shipments-title">
      <header className="sender-section-header">
        <div>
          <h2 id="shipments-title">Mis envíos</h2>
          <p>Consulta tus paquetes y selecciona un código para ver el detalle.</p>
        </div>
      </header>

      <FiltrosEnvios
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
      <TablaEnvios envios={enviosFiltrados} onSeleccionar={setSeleccionado} />
    </section>
  )
}
