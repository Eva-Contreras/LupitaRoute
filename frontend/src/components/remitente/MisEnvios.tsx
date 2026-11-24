import { useState } from 'react'
import { FiltrosEnvios } from './FiltrosEnvios'
import { TablaEnvios } from './TablaEnvios'
import type { EnvioDetalle, EstadoPaquete } from '../../types/lupita.types'

interface MisEnviosProps {
  envios: EnvioDetalle[]
  estados: EstadoPaquete[]
}

export function MisEnvios({ envios, estados }: MisEnviosProps) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

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
          <p>Consulta tus paquetes y su estado más reciente.</p>
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
      <TablaEnvios envios={enviosFiltrados} />
    </section>
  )
}
