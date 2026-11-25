import { useState, type FormEvent } from 'react'
import { DetalleEnvio } from '../DetalleEnvio'
import { rastrearEnvio } from '../../services/envios'
import type { EnvioDetalle, EnvioRastreo } from '../../types/envio.types'

interface RastrearPaqueteProps {
  onActualizarLista: (envio: EnvioDetalle) => void
}

export function RastrearPaquete({ onActualizarLista }: RastrearPaqueteProps) {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState<EnvioRastreo | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function consultar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const codigoLimpio = codigo.trim()
    if (!codigoLimpio) {
      setError('Ingresa un código de rastreo.')
      return
    }

    setCargando(true)
    setError(null)
    try {
      const envio = await rastrearEnvio(codigoLimpio)
      setResultado(envio)
      onActualizarLista(envio)
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'No se pudo consultar el envío.')
    } finally {
      setCargando(false)
    }
  }

  if (resultado) {
    return (
      <DetalleEnvio
        envio={resultado}
        rastreoInicial={resultado}
        mostrarRemitente
        textoVolver="Volver a rastrear"
        onVolver={(actualizado) => {
          if (actualizado) onActualizarLista(actualizado)
          setResultado(null)
        }}
      />
    )
  }

  return (
    <section className="dashboard-section tracking-card" aria-labelledby="tracking-title">
      <h2 id="tracking-title">Rastrea tu paquete</h2>
      <p>Ingresa el código de rastreo que te compartieron.</p>
      <form className="tracking-form" onSubmit={consultar}>
        <label className="visually-hidden" htmlFor="codigo-rastreo">Código de rastreo</label>
        <input
          id="codigo-rastreo"
          name="codigo-rastreo"
          type="text"
          placeholder="Ej. LUP-2026-0001"
          value={codigo}
          onChange={(event) => setCodigo(event.currentTarget.value)}
          required
          disabled={cargando}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Consultando…' : 'Consultar'}
        </button>
      </form>
      {error && <div role="alert"><p className="panel-state__error">{error}</p></div>}
    </section>
  )
}
