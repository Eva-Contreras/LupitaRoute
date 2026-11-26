import { useState } from 'react'
import { BrandName } from '../components/BrandName'
import { ReceptorPanel } from '../components/receptor/ReceptorPanel'
import { RepartidorPanel } from '../components/repartidor/RepartidorPanel'
import { RemitentePanel } from '../components/remitente/RemitentePanel'
import { RegistroUsuarioPage } from './RegistroUsuarioPage'
import type { Usuario } from '../types/auth.types'

interface PanelPageProps {
  usuario: Usuario
  token: string
  onExit: () => void
}

export function PanelPage({ usuario, token, onExit }: PanelPageProps) {
  const rol = usuario.rol
  const [registrando, setRegistrando] = useState(false)
  const [registroCompletado, setRegistroCompletado] = useState(false)
  const puedeRegistrar = rol === 'Remitente' || rol === 'Repartidor'

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="#inicio" aria-label="LupitaRoute, inicio">
          <BrandName />
        </a>
        <div className="dashboard-header-actions">
          {puedeRegistrar && !registrando && (
            <button className="dashboard-exit" type="button" onClick={() => {
              setRegistroCompletado(false)
              setRegistrando(true)
            }}>
              Crear cuenta de {rol.toLowerCase()}
            </button>
          )}
          <button className="dashboard-exit" type="button" onClick={onExit}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main" id="inicio">
        {registrando && puedeRegistrar ? (
          <RegistroUsuarioPage
            rol={rol}
            enPanel
            onVolver={() => setRegistrando(false)}
            onRegistrado={() => {
              setRegistrando(false)
              setRegistroCompletado(true)
            }}
          />
        ) : (
          <>
            <section className="dashboard-welcome">
              <p className="dashboard-eyebrow">Panel de control · {rol}</p>
              <h1>Hola, {usuario.nombreCompleto}</h1>
              <p>Consulta y administra tus envíos desde un solo lugar.</p>
            </section>

            {registroCompletado && (
              <p className="login-success" role="status">
                Cuenta de {rol.toLowerCase()} creada correctamente.
              </p>
            )}
            {rol === 'Remitente' && (
              <RemitentePanel token={token} onSesionExpirada={onExit} />
            )}
            {rol === 'Repartidor' && (
              <RepartidorPanel token={token} onSesionExpirada={onExit} />
            )}
            {rol === 'Receptor' && (
              <ReceptorPanel token={token} onSesionExpirada={onExit} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
