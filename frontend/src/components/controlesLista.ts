export interface ControlesLista {
  busqueda: string
  estadoId: string
  pagina: number
  totalPaginas: number
  totalRegistros: number
  actualizando: boolean
  onCambiarBusqueda: (valor: string) => void
  onCambiarEstado: (valor: string) => void
  onCambiarPagina: (valor: number) => void
}
