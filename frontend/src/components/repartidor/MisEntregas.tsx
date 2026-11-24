import { useState } from 'react'
import { FiltrosEntregas } from './FiltrosEntregas'
import { TablaEntregas } from './TablaEntregas'
import { DetalleEnvio } from '../shared/DetalleEnvio'
import type { EnvioDetalle, EstadoPaquete } from '../../types/envio.types'

interface MisEntregasProps {
  entregas: EnvioDetalle[]
  estados: EstadoPaquete[]
  onActualizar: (envioId: number) => void
  onActualizarLista: (envio: EnvioDetalle) => void
  onRecargar: () => void
  recoleccion: { envioId: number; codigo: string } | null
}

export function MisEntregas({
  entregas,
  estados,
  onActualizar,
  onActualizarLista,
  onRecargar,
  recoleccion,
}: MisEntregasProps) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)

  if (seleccionado) {
    return (
      <DetalleEnvio
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

  const termino = busqueda.trim().toLocaleLowerCase()
  const entregasFiltradas = entregas
    .filter((entrega) => {
      const coincideBusqueda =
        termino.length === 0 ||
        entrega.codigoRastreo.toLocaleLowerCase().includes(termino) ||
        entrega.receptor.toLocaleLowerCase().includes(termino)
      const fechaCreacion = entrega.fechaCreacion.slice(0, 10)
      const coincideEstado = estado === '' || entrega.estadoActual === estado
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

  const enReparto = entregas.filter((e) => e.estadoActual === 'En reparto').length
  const entregadas = entregas.filter((e) => e.estadoActual === 'Entregado').length

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
          {entregas.some((entrega) => entrega.envioId === recoleccion.envioId)
            ? `La recolección de ${recoleccion.codigo} se registró y el envío aparece en tus entregas.`
            : `La API aceptó la recolección de ${recoleccion.codigo}, pero el envío no aparece en tus entregas. Actualiza la lista o consulta con un administrador.`}
        </p>
      )}

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

      <FiltrosEntregas
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
      <TablaEntregas entregas={entregasFiltradas} onActualizar={onActualizar} onSeleccionar={setSeleccionado} />
    </section>
  )
}
