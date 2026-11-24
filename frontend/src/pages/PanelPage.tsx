import { BrandName } from '../components/BrandName'
import { ReceptorPanel } from '../components/ReceptorPanel'
import { RepartidorPanel } from '../components/RepartidorPanel'
import { PanelRemitente } from '../components/remitente/PanelRemitente'
import type { Usuario } from '../types/lupita.types'

interface PanelPageProps {
  usuario: Usuario
  onExit: () => void
}

export function PanelPage({ usuario, onExit }: PanelPageProps) {
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

        {rol === 'Remitente' && <PanelRemitente />}
        {rol === 'Repartidor' && <RepartidorPanel />}
        {rol === 'Receptor' && <ReceptorPanel />}
      </main>
    </div>
  )
}
