import { useState } from 'react'
import { DetalleEnvio } from '../DetalleEnvio'
import { FiltrosEnvios } from '../FiltrosEnvios'
import { filtrarEnvios } from '../filtrarEnvios'
import { TablaEnvios } from '../TablaEnvios'
import type { EnvioDetalle, EstadoPaquete } from '../../types/envio.types'

interface MisPaquetesProps {
  envios: EnvioDetalle[]
  estados: EstadoPaquete[]
  onActualizar: (envio: EnvioDetalle) => void
  onRecargar: () => void
}

export function MisPaquetes({ envios, estados, onActualizar, onRecargar }: MisPaquetesProps) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [seleccionado, setSeleccionado] = useState<EnvioDetalle | null>(null)

  if (seleccionado) {
    return (
      <DetalleEnvio
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

  const filtrados = filtrarEnvios(envios, {
    busqueda, estado, fechaDesde, fechaHasta, persona: 'remitente',
  })

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
      <FiltrosEnvios
        etiqueta="Filtros de paquetes"
        estados={estados}
        busqueda={busqueda}
        estado={estado}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        placeholderBusqueda="Código o remitente"
        onCambiarBusqueda={setBusqueda}
        onCambiarEstado={setEstado}
        onCambiarFechaDesde={setFechaDesde}
        onCambiarFechaHasta={setFechaHasta}
      />
      {envios.length === 0 ? (
        <p className="shipment-empty">Aún no tienes paquetes asociados a tu cuenta.</p>
      ) : (
        <TablaEnvios vista="receptor" envios={filtrados} onSeleccionar={setSeleccionado} />
      )}
    </section>
  )
}
