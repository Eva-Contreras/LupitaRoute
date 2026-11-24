import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { PanelPage } from './pages/PanelPage'
import { RegistroReceptorPage } from './pages/RegistroReceptorPage'
import type { AuthResponse } from './types/auth.types'

export default function App() {
  const [session, setSession] = useState<AuthResponse | null>(null)
  const [registrando, setRegistrando] = useState(false)
  const [registroCompletado, setRegistroCompletado] = useState(false)

  return (
    <div className="App">
      {session ? (
        <PanelPage
          usuario={session.usuario}
          token={session.token}
          onExit={() => setSession(null)}
        />
      ) : registrando ? (
        <RegistroReceptorPage
          onVolver={() => setRegistrando(false)}
          onRegistrado={() => {
            setRegistroCompletado(true)
            setRegistrando(false)
          }}
        />
      ) : (
        <LoginPage
          onAccept={(nuevaSesion) => {
            setRegistroCompletado(false)
            setSession(nuevaSesion)
          }}
          registroCompletado={registroCompletado}
          onCrearCuenta={() => {
            setRegistroCompletado(false)
            setRegistrando(true)
          }}
        />
      )}
    </div>
  )
}
