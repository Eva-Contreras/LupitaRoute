import { useState } from 'react'
import { ActualizarEstado } from './ActualizarEstado'
import { MisEntregas } from './MisEntregas'
import { NavegacionRepartidor } from './NavegacionRepartidor'
import type { SeccionRepartidor } from './NavegacionRepartidor'
import { entregasDemo } from '../../data/enviosDemo'
import type { EntregaDemostracion, EstadoEnvio } from '../../types/envio.types'

export function RepartidorPanel() {
  const [seccion, setSeccion] = useState<SeccionRepartidor>('entregas')
  const [entregas, setEntregas] = useState<EntregaDemostracion[]>(entregasDemo)
  const [codigoSeleccionado, setCodigoSeleccionado] = useState('')

  function irAActualizar(codigo: string) {
    setCodigoSeleccionado(codigo)
    setSeccion('actualizar')
  }

  function guardarEstado(
    codigo: string,
    estado: EstadoEnvio,
    comentario: string,
    ubicacionActual: string,
  ) {
    setEntregas((actuales) =>
      actuales.map((entrega) =>
        entrega.codigo === codigo
          ? {
              ...entrega,
              estado,
              comentario: comentario || undefined,
              ubicacionActual: ubicacionActual || undefined,
              ultimaActualizacion: new Date().toISOString(),
            }
          : entrega,
      ),
    )
  }

  return (
    <div className="role-content sender-layout">
      <NavegacionRepartidor
        seccionActiva={seccion}
        onCambiarSeccion={setSeccion}
      />
      {seccion === 'entregas' && (
        <MisEntregas entregas={entregas} onActualizar={irAActualizar} />
      )}
      {seccion === 'actualizar' && (
        <ActualizarEstado
          key={codigoSeleccionado}
          entregas={entregas}
          codigoInicial={codigoSeleccionado}
          onGuardar={guardarEstado}
        />
      )}
    </div>
  )
}
