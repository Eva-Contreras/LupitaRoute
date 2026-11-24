// "En tránsito" -> "en-transito", "Cancelado" -> "cancelado"
export function claseEstado(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, '-')
}
