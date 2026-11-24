import { useState } from 'react'
import { ActualizarEstado } from './ActualizarEstado'
import { MisEntregas } from './MisEntregas'
import { NavegacionRepartidor } from './NavegacionRepartidor'
import type { SeccionRepartidor } from './NavegacionRepartidor'
import { useEntregas } from '../../hooks/useEntregas'

interface RepartidorPanelProps {
  token: string
  onSesionExpirada: () => void
}

export function RepartidorPanel({
  token,
  onSesionExpirada,
}: RepartidorPanelProps) {
  const [seccion, setSeccion] = useState<SeccionRepartidor>('entregas')
  const [envioSeleccionado, setEnvioSeleccionado] = useState<number | null>(
    null,
  )
  const { envios, estados, cargando, error, reintentar, cambiarEstado } =
    useEntregas(token)

  function irAActualizar(envioId: number) {
    setEnvioSeleccionado(envioId)
    setSeccion('actualizar')
  }

  let contenido
  if (cargando) {
    contenido = (
      <section className="sender-shipments panel-state" role="status">
        <p>Cargando tus entregas…</p>
      </section>
    )
  } else if (error) {
    contenido = (
      <section className="sender-shipments panel-state" role="alert">
        <p className="panel-state__error">{error.mensaje}</p>
        {error.sesionExpirada ? (
          <button
            className="shipment-action"
            type="button"
            onClick={onSesionExpirada}
          >
            Volver a iniciar sesión
          </button>
        ) : (
          <button className="shipment-action" type="button" onClick={reintentar}>
            Reintentar
          </button>
        )}
      </section>
    )
  } else if (seccion === 'entregas') {
    contenido = (
      <MisEntregas
        entregas={envios}
        estados={estados}
        onActualizar={irAActualizar}
      />
    )
  } else {
    contenido = (
      <ActualizarEstado
        key={envioSeleccionado ?? 'sin-seleccion'}
        entregas={envios}
        estados={estados}
        envioIdInicial={envioSeleccionado}
        onGuardar={cambiarEstado}
      />
    )
  }

  return (
    <div className="role-content sender-layout">
      <NavegacionRepartidor
        seccionActiva={seccion}
        onCambiarSeccion={setSeccion}
      />
      {contenido}
    </div>
  )
}
