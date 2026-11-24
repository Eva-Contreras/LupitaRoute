import { useState } from 'react'
import { FiltrosEnvios } from './FiltrosEnvios'
import { TablaEnvios } from './TablaEnvios'
import { enviosDemo } from '../../data/enviosDemo'
import type { EstadoEnvio } from '../../types/envio.types'

export function MisEnvios() {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<EstadoEnvio | ''>('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const termino = busqueda.trim().toLocaleLowerCase()
  const enviosFiltrados = enviosDemo
    .filter((envio) => {
      const coincideBusqueda =
        termino.length === 0 ||
        envio.codigo.toLocaleLowerCase().includes(termino) ||
        envio.destinatario.toLocaleLowerCase().includes(termino)
      const fechaActualizacion = envio.ultimaActualizacion.slice(0, 10)
      const coincideEstado = estado === '' || envio.estado === estado
      const coincideFechaDesde =
        fechaDesde === '' || fechaActualizacion >= fechaDesde
      const coincideFechaHasta =
        fechaHasta === '' || fechaActualizacion <= fechaHasta

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideFechaDesde &&
        coincideFechaHasta
      )
    })
    .sort(
      (envioA, envioB) =>
        new Date(envioB.ultimaActualizacion).getTime() -
        new Date(envioA.ultimaActualizacion).getTime(),
    )

  return (
    <section className="sender-shipments" aria-labelledby="shipments-title">
      <header className="sender-section-header">
        <div>
          <h2 id="shipments-title">Mis envíos</h2>
          <p>Consulta tus paquetes y su estado más reciente.</p>
        </div>
        <span className="section-caption">Datos de demostración</span>
      </header>

      <FiltrosEnvios
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
