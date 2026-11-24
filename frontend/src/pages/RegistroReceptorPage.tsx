import { useState, type FormEvent } from 'react'
import { BrandName } from '../components/shared/BrandName'
import { registrarReceptor } from '../services/auth'

interface RegistroReceptorPageProps {
  onVolver: () => void
  onRegistrado: () => void
}

export function RegistroReceptorPage({ onVolver, onRegistrado }: RegistroReceptorPageProps) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!nombre.trim()) {
      setError('Escribe tu nombre completo.')
      return
    }
    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)
    try {
      await registrarReceptor({
        nombreCompleto: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        password,
        ...(telefono.trim() ? { telefono: telefono.trim() } : {}),
      })
      onRegistrado()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Ocurrió un error inesperado al crear la cuenta.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <header className="login-header">
          <h1><BrandName /></h1>
          <p>Crea tu cuenta de receptor</p>
        </header>
        <div className="login-field">
          <label htmlFor="registro-nombre">Nombre completo</label>
          <input id="registro-nombre" name="nombre" autoComplete="name" required
            value={nombre} onChange={(event) => setNombre(event.currentTarget.value)} />
        </div>
        <div className="login-field">
          <label htmlFor="registro-correo">Correo electrónico</label>
          <input id="registro-correo" name="correo" type="email" autoComplete="email" required
            value={correo} onChange={(event) => setCorreo(event.currentTarget.value)} />
        </div>
        <div className="login-field">
          <label htmlFor="registro-telefono">Teléfono (opcional)</label>
          <input id="registro-telefono" name="telefono" type="tel" autoComplete="tel"
            value={telefono} onChange={(event) => setTelefono(event.currentTarget.value)} />
        </div>
        <div className="login-field">
          <label htmlFor="registro-password">Contraseña</label>
          <input id="registro-password" name="password" type="password" autoComplete="new-password"
            minLength={6} required value={password}
            onChange={(event) => setPassword(event.currentTarget.value)} />
          <small>Mínimo 6 caracteres.</small>
        </div>
        <div className="login-field">
          <label htmlFor="registro-confirmacion">Confirmar contraseña</label>
          <input id="registro-confirmacion" name="confirmacion" type="password"
            autoComplete="new-password" required value={confirmacion}
            onChange={(event) => setConfirmacion(event.currentTarget.value)} />
        </div>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="login-button" type="submit" disabled={cargando}>
          {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
        <p className="login-switch">
          ¿Ya tienes cuenta?{' '}
          <button type="button" onClick={onVolver} disabled={cargando}>Inicia sesión</button>
        </p>
      </form>
    </main>
  )
}
