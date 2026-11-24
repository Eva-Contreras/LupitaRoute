import { useState } from 'react'
import { CotizarEnvio } from './CotizarEnvio'
import { CrearEnvio } from './CrearEnvio'
import { MisEnvios } from './MisEnvios'
import { NavegacionRemitente } from './NavegacionRemitente'
import type { SeccionRemitente } from './NavegacionRemitente'

export function RemitentePanel() {
  const [seccion, setSeccion] = useState<SeccionRemitente>('envios')

  return (
    <div className="role-content sender-layout">
      <NavegacionRemitente
        seccionActiva={seccion}
        onCambiarSeccion={setSeccion}
      />
      {seccion === 'envios' && <MisEnvios />}
      {seccion === 'cotizar' && <CotizarEnvio />}
      {seccion === 'crear' && <CrearEnvio />}
    </div>
  )
}
