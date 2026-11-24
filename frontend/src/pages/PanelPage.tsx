import { useState } from 'react'
import { BrandName } from '../components/BrandName'
import { ReceptorPanel } from '../components/ReceptorPanel'
import { RepartidorPanel } from '../components/RepartidorPanel'
import { RemitentePanel } from '../components/RemitentePanel'
import type { RolNombre } from '../types/lupita.types'

interface PanelPageProps {
  onExit: () => void
}

const nombresPorRol: Record<RolNombre, string> = {
  Remitente: 'María López',
  Repartidor: 'Carlos Ruiz',
  Receptor: 'Ana García',
}

export function PanelPage({ onExit }: PanelPageProps) {
  const [rol, setRol] = useState<RolNombre>('Remitente')

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="#inicio" aria-label="LupitaRoute, inicio">
          <BrandName />
        </a>
        <div className="dashboard-header-actions">
          <label className="role-preview">
            <span>Vista de demostración</span>
            <select
              aria-label="Seleccionar rol para previsualizar"
              value={rol}
              onChange={(event) => {
                const nuevoRol = event.currentTarget.value
                if (
                  nuevoRol === 'Remitente' ||
                  nuevoRol === 'Repartidor' ||
                  nuevoRol === 'Receptor'
                ) {
                  setRol(nuevoRol)
                }
              }}
            >
              <option value="Remitente">Remitente</option>
              <option value="Repartidor">Repartidor</option>
              <option value="Receptor">Receptor</option>
            </select>
          </label>
          <button className="dashboard-exit" type="button" onClick={onExit}>
            Volver al inicio
          </button>
        </div>
      </header>

      <main className="dashboard-main" id="inicio">
        <section className="dashboard-welcome">
          <p className="dashboard-eyebrow">Panel de control · {rol}</p>
          <h1>Hola, {nombresPorRol[rol]}</h1>
          <p>Consulta y administra tus envíos desde un solo lugar.</p>
        </section>

        {rol === 'Remitente' && <RemitentePanel />}
        {rol === 'Repartidor' && <RepartidorPanel />}
        {rol === 'Receptor' && <ReceptorPanel />}
      </main>
    </div>
  )
}
