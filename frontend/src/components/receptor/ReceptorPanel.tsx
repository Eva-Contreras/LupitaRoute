import { useState } from 'react'
import { useEnvios } from '../../hooks/useEnvios'
import { MisPaquetes } from './MisPaquetes'
import { RastrearPaquete } from './RastrearPaquete'

interface ReceptorPanelProps {
  token: string
  onSesionExpirada: () => void
}

export function ReceptorPanel({ token, onSesionExpirada }: ReceptorPanelProps) {
  const [seccion, setSeccion] = useState<'paquetes' | 'rastreo'>('paquetes')
  const { envios, estados, cargando, error, reintentar, actualizarEnLista } =
    useEnvios(token)

  let contenido
  if (seccion === 'rastreo') {
    contenido = <RastrearPaquete onActualizarLista={actualizarEnLista} />
  } else if (cargando) {
    contenido = (
      <section className="sender-shipments panel-state" role="status">
        <p>Cargando tus paquetes…</p>
      </section>
    )
  } else if (error) {
    contenido = (
      <section className="sender-shipments panel-state" role="alert">
        <p className="panel-state__error">{error.mensaje}</p>
        {error.sesionExpirada ? (
          <button className="shipment-action" type="button" onClick={onSesionExpirada}>
            Volver a iniciar sesión
          </button>
        ) : (
          <button className="shipment-action" type="button" onClick={reintentar}>
            Reintentar
          </button>
        )}
      </section>
    )
  } else {
    contenido = (
      <MisPaquetes
        envios={envios}
        estados={estados}
        onActualizar={actualizarEnLista}
        onRecargar={reintentar}
      />
    )
  }

  return (
    <div className="role-content sender-layout">
      <aside className="sender-sidebar" aria-label="Navegación de receptor">
        <h2>Paquetes</h2>
        <nav className="sender-nav">
          <button
            className={`sender-nav-item${seccion === 'paquetes' ? ' sender-nav-item--active' : ''}`}
            type="button"
            aria-current={seccion === 'paquetes' ? 'page' : undefined}
            onClick={() => setSeccion('paquetes')}
          >
            Mis paquetes
          </button>
          <button
            className={`sender-nav-item${seccion === 'rastreo' ? ' sender-nav-item--active' : ''}`}
            type="button"
            aria-current={seccion === 'rastreo' ? 'page' : undefined}
            onClick={() => setSeccion('rastreo')}
          >
            Rastrear paquete
          </button>
        </nav>
      </aside>
      {contenido}
    </div>
  )
}
