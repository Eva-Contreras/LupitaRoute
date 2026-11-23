import { BrandName } from '../components/BrandName'

export function LoginPage() {
  return (
    <main className="login-page">
      <form className="login-card">
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
        <button className="login-button" type="button">
          Aceptar
        </button>
      </form>
    </main>
  )
}
