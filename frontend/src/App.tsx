import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { PanelPage } from './pages/PanelPage'
import type { AuthResponse } from './types/lupita.types'

export default function App() {
  const [session, setSession] = useState<AuthResponse | null>(null)

  return (
    <div className="App">
      {session ? (
        <PanelPage
          usuario={session.usuario}
          onExit={() => setSession(null)}
        />
      ) : (
        <LoginPage onAccept={setSession} />
      )}
    </div>
  )
}
