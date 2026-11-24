import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { PanelPage } from './pages/PanelPage'

export default function App() {
  const [showPanel, setShowPanel] = useState(false)

  return (
    <div className="App">
      {showPanel ? (
        <PanelPage onExit={() => setShowPanel(false)} />
      ) : (
        <LoginPage onAccept={() => setShowPanel(true)} />
      )}
    </div>
  )
}
