import { useState } from 'react'
import { FiltrosEnvios } from '../remitente/FiltrosEnvios'
import { TablaEntregas } from './TablaEntregas'
import type { EntregaDemostracion, EstadoEnvio } from '../../types/envio.types'

interface MisEntregasProps {
  entregas: EntregaDemostracion[]
  onActualizar: (codigo: string) => void
}

export function MisEntregas({ entregas, onActualizar }: MisEntregasProps) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<EstadoEnvio | ''>('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const termino = busqueda.trim().toLocaleLowerCase()
  const entregasFiltradas = entregas
    .filter((entrega) => {
      const coincideBusqueda =
        termino.length === 0 ||
        entrega.codigo.toLocaleLowerCase().includes(termino) ||
        entrega.destinatario.toLocaleLowerCase().includes(termino)
      const fechaActualizacion = entrega.ultimaActualizacion.slice(0, 10)
      const coincideEstado = estado === '' || entrega.estado === estado
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
      (a, b) =>
        new Date(b.ultimaActualizacion).getTime() -
        new Date(a.ultimaActualizacion).getTime(),
    )

  const enReparto = entregas.filter((e) => e.estado === 'En reparto').length
  const entregadas = entregas.filter((e) => e.estado === 'Entregado').length

  return (
    <section className="sender-shipments" aria-labelledby="deliveries-title">
      <header className="sender-section-header">
        <div>
          <h2 id="deliveries-title">Mis entregas</h2>
          <p>Revisa los paquetes asignados a ti y actualiza su estado.</p>
        </div>
        <span className="section-caption">Datos de demostración</span>
      </header>

      <div className="courier-metrics">
        <article className="metric-card">
          <span>Entregas asignadas</span>
          <strong>{entregas.length}</strong>
        </article>
        <article className="metric-card">
          <span>En reparto</span>
          <strong>{enReparto}</strong>
        </article>
        <article className="metric-card">
          <span>Entregadas</span>
          <strong>{entregadas}</strong>
        </article>
      </div>

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
      <TablaEntregas
        entregas={entregasFiltradas}
        onActualizar={onActualizar}
      />
    </section>
  )
}
