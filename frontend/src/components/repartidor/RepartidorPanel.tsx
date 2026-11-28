import { useState } from 'react'
import { ActualizarEstado } from './ActualizarEstado'
import { EnviosDisponibles } from './EnviosDisponibles'
import { MisEntregas } from './MisEntregas'
import { NavegacionRepartidor } from './NavegacionRepartidor'
import type { SeccionRepartidor } from './NavegacionRepartidor'
import { useEntregas } from '../../hooks/useEntregas'
import { asignarYRegistrarRecoleccion, obtenerEstados } from '../../services/envios'

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
  const [registrando, setRegistrando] = useState(false)
  const [recoleccion, setRecoleccion] = useState<{ envioId: number; codigo: string } | null>(null)
  const {
    envios,
    estados,
    controles,
    entregasSelector,
    cargandoSelector,
    errorSelector,
    intento,
    cargando,
    error,
    reintentar,
    cambiarEstado,
    actualizarEnLista,
  } = useEntregas(token)

  function irAActualizar(envioId: number) {
    setEnvioSeleccionado(envioId)
    setSeccion('actualizar')
  }

  async function registrarRecoleccion(envioId: number, codigo: string) {
    setRegistrando(true)
    try {
      const catalogo = await obtenerEstados()
      const recolectados = catalogo.filter(
        (estado) => estado.nombre.trim().toLocaleLowerCase('es-MX') === 'recolectado',
      )
      if (recolectados.length !== 1) {
        throw new Error('No se pudo identificar el estado Recolectado en el catálogo.')
      }
      await asignarYRegistrarRecoleccion(token, envioId, recolectados[0].estadoId)
      setRecoleccion({ envioId, codigo })
      reintentar()
      setSeccion('entregas')
    } finally {
      setRegistrando(false)
    }
  }

  let contenido
  if (seccion === 'disponibles') {
    contenido = (
      <EnviosDisponibles
        token={token}
        onSesionExpirada={onSesionExpirada}
        onRecolectar={registrarRecoleccion}
        registrando={registrando}
      />
    )
  } else if (cargando) {
    contenido = (
      <section className="sender-shipments panel-state" role="status">
        <p>Cargando tus entregas…</p>
      </section>
    )
  } else if (error) {
    contenido = (
      <section className="sender-shipments panel-state" role="alert">
        <p className="panel-state__error">{error.mensaje}</p>
        {recoleccion && seccion === 'entregas' && (
          <p>La API aceptó la recolección de {recoleccion.codigo}, pero no se pudo actualizar la lista.</p>
        )}
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
        token={token}
        entregas={envios}
        estados={estados}
        controles={controles}
        actualizacion={intento}
        onSesionExpirada={onSesionExpirada}
        onActualizar={irAActualizar}
        onActualizarLista={actualizarEnLista}
        onRecargar={reintentar}
        recoleccion={recoleccion}
      />
    )
  } else if (cargandoSelector) {
    contenido = <section className="sender-shipments panel-state" role="status">Cargando entregas…</section>
  } else if (errorSelector) {
    contenido = (
      <section className="sender-shipments panel-state" role="alert">
        <p className="panel-state__error">{errorSelector.mensaje}</p>
        <button className="shipment-action" type="button" onClick={errorSelector.sesionExpirada ? onSesionExpirada : reintentar}>
          {errorSelector.sesionExpirada ? 'Volver a iniciar sesión' : 'Reintentar'}
        </button>
      </section>
    )
  } else {
    contenido = (
      <ActualizarEstado
        key={envioSeleccionado ?? 'sin-seleccion'}
        entregas={entregasSelector}
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
        deshabilitada={registrando}
      />
      {contenido}
    </div>
  )
}
