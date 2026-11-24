import { useState, type FormEvent } from 'react'
import { BrandName } from '../components/BrandName'
import { login } from '../services/auth'
import type { AuthResponse } from '../types/lupita.types'

interface LoginPageProps {
  onAccept: (session: AuthResponse) => void
}

export function LoginPage({ onAccept }: LoginPageProps) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCargando(true)
    setError(null)

    try {
      const session = await login(correo, password)
      onAccept(session)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Ocurrió un error inesperado al iniciar sesión.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <header className="login-header">
          <h1>
            <BrandName />
          </h1>
          <p>Inicia sesión para continuar</p>
        </header>
        <div className="login-field">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="username"
            required
            value={correo}
            onChange={(event) => setCorreo(event.currentTarget.value)}
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </div>
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
        <button className="login-button" type="submit" disabled={cargando}>
          {cargando ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  )
}
