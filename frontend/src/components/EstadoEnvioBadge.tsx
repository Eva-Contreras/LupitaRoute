import { claseEstado } from '../utils/claseEstado'

interface EstadoEnvioBadgeProps {
  estado: string
}

export function EstadoEnvioBadge({ estado }: EstadoEnvioBadgeProps) {
  return (
    <span className={`status-badge status-badge--${claseEstado(estado)}`}>
      {estado}
    </span>
  )
}
