import { useState } from 'react'
import { CotizarEnvio } from './CotizarEnvio'
import { MisEnvios } from './MisEnvios'
import { NavegacionRemitente } from './NavegacionRemitente'
import type { SeccionRemitente } from './NavegacionRemitente'

export function PanelRemitente() {
  const [seccion, setSeccion] = useState<SeccionRemitente>('envios')

  return (
    <div className="role-content sender-layout">
      <NavegacionRemitente
        seccionActiva={seccion}
        onCambiarSeccion={setSeccion}
      />
      {seccion === 'envios' ? <MisEnvios /> : <CotizarEnvio />}
    </div>
  )
}
