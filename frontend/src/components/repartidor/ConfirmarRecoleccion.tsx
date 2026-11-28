import type { ErrorVista } from '../../hooks/useListaEnvios'
import type { EnvioDetalle } from '../../types/envio.types'

interface ConfirmarRecoleccionProps {
  envio: EnvioDetalle
  error: ErrorVista | null
  registrando: boolean
  onConfirmar: () => void
  onVolver: () => void
  onSesionExpirada: () => void
}

export function ConfirmarRecoleccion({
  envio,
  error,
  registrando,
  onConfirmar,
  onVolver,
  onSesionExpirada,
}: ConfirmarRecoleccionProps) {
  return (
    <section className="sender-shipments courier-pickup" aria-labelledby="confirmar-recoleccion-title">
      <header className="courier-pickup__header">
        <div className="courier-pickup__heading">
          <span className="courier-pickup__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
              <path d="m3 7 9 4 9-4M12 11v10M7.5 5l9 4" />
            </svg>
          </span>
          <div>
            <span className="courier-pickup__eyebrow">Recolección de paquete</span>
            <h2 id="confirmar-recoleccion-title">Registrar recolección</h2>
            <p>Revisa los datos antes de continuar.</p>
          </div>
        </div>
        <div className="courier-pickup__code">
          <span>Código de rastreo</span>
          <strong>{envio.codigoRastreo}</strong>
        </div>
      </header>
      <div className="courier-confirmation">
        <div className="courier-pickup__details">
          <div className="courier-pickup__recipient">
            <span className="courier-pickup__label">Receptor</span>
            <strong>{envio.receptor}</strong>
          </div>
          <div className="courier-pickup__route">
            <h3>Ruta del envío</h3>
            <dl className="courier-pickup__stops">
              <div className="courier-pickup__stop">
                <dt>Dirección de origen</dt>
                <dd>{envio.direccionOrigen}</dd>
              </div>
              <div className="courier-pickup__stop">
                <dt>Dirección de entrega</dt>
                <dd>{envio.direccionDestino}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="courier-pickup__notice">
          <span className="courier-pickup__notice-icon" aria-hidden="true">!</span>
          <div>
            <strong>Antes de confirmar</strong>
            <p>Confirma solo si ya recolectaste el paquete. Se asignará a tu cuenta y su estado cambiará a Recolectado.</p>
          </div>
        </div>
        {error && (
          <div className="courier-pickup__error" role="alert">
            <p className="panel-state__error">{error.mensaje}</p>
            <p>Si la solicitud llegó al servidor, revisa Mis entregas antes de volver a intentarlo.</p>
            {error.sesionExpirada && (
              <button className="shipment-action" type="button" onClick={onSesionExpirada}>
                Volver a iniciar sesión
              </button>
            )}
          </div>
        )}
        <div className="courier-confirmation__actions">
          <button
            className="quote-submit courier-pickup__confirm"
            type="button"
            disabled={registrando || error?.sesionExpirada}
            onClick={onConfirmar}
          >
            {registrando ? 'Registrando…' : 'Confirmar recolección'}
          </button>
          <button
            className="shipment-action courier-pickup__back"
            type="button"
            disabled={registrando}
            onClick={onVolver}
          >
            Volver a disponibles
          </button>
        </div>
      </div>
    </section>
  )
}
