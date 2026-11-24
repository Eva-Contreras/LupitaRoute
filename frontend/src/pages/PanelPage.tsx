import { BrandName } from '../components/BrandName'
import { ReceptorPanel } from '../components/receptor/ReceptorPanel'
import { RepartidorPanel } from '../components/repartidor/RepartidorPanel'
import { RemitentePanel } from '../components/remitente/RemitentePanel'
import type { Usuario } from '../types/lupita.types'

interface PanelPageProps {
  usuario: Usuario
  token: string
  onExit: () => void
}

export function PanelPage({ usuario, token, onExit }: PanelPageProps) {
  const rol = usuario.rol

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="#inicio" aria-label="LupitaRoute, inicio">
          <BrandName />
        </a>
        <div className="dashboard-header-actions">
          <button className="dashboard-exit" type="button" onClick={onExit}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main" id="inicio">
        <section className="dashboard-welcome">
          <p className="dashboard-eyebrow">Panel de control · {rol}</p>
          <h1>Hola, {usuario.nombreCompleto}</h1>
          <p>Consulta y administra tus envíos desde un solo lugar.</p>
        </section>

        {rol === 'Remitente' && <RemitentePanel />}
        {rol === 'Repartidor' && (
          <RepartidorPanel token={token} onSesionExpirada={onExit} />
        )}
        {rol === 'Receptor' && <ReceptorPanel />}
      </main>
    </div>
  )
}
