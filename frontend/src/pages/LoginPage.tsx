import { BrandName } from '../components/BrandName'

interface LoginPageProps {
  onAccept: () => void
}

export function LoginPage({ onAccept }: LoginPageProps) {
  return (
    <main className="login-page">
      <form
        className="login-card"
        onSubmit={(event) => {
          event.preventDefault()
          onAccept()
        }}
      >
        <header className="login-header">
          <h1>
            <BrandName />
          </h1>
          <p>Inicia sesión para continuar</p>
        </header>
        <div className="login-field">
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
          />
        </div>
        <div className="login-field">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <button className="login-button" type="submit">
          Aceptar
        </button>
        <p className="login-demo-note">
          Vista de demostración: no se validan las credenciales.
        </p>
      </form>
    </main>
  )
}
