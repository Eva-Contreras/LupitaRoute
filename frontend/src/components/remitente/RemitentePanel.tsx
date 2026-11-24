import { useState } from 'react'
import { CotizarEnvio } from './CotizarEnvio'
import { CrearEnvio } from './CrearEnvio'
import { MisEnvios } from './MisEnvios'
import { NavegacionRemitente } from './NavegacionRemitente'
import type { SeccionRemitente } from './NavegacionRemitente'
import { useEnvios } from '../../hooks/useEnvios'

interface RemitentePanelProps {
  token: string
  onSesionExpirada: () => void
}

export function RemitentePanel({
  token,
  onSesionExpirada,
}: RemitentePanelProps) {
  const [seccion, setSeccion] = useState<SeccionRemitente>('envios')
  const { envios, estados, cargando, error, reintentar, crear, actualizarEnLista } =
    useEnvios(token)

  let contenido
  if (seccion === 'cotizar') {
    contenido = <CotizarEnvio />
  } else if (seccion === 'crear') {
    contenido = <CrearEnvio onCrear={crear} />
  } else if (cargando) {
    contenido = (
      <section className="sender-shipments panel-state" role="status">
        <p>Cargando tus envíos…</p>
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
  } else {
    contenido = <MisEnvios envios={envios} estados={estados} onActualizar={actualizarEnLista} />
  }

  return (
    <div className="role-content sender-layout">
      <NavegacionRemitente
        seccionActiva={seccion}
        onCambiarSeccion={setSeccion}
      />
      {contenido}
    </div>
  )
}
