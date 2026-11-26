using System.ComponentModel.DataAnnotations;

namespace LupitaRoute.Api.DTOs;

public class AsignarEnvioRequestDto
{
    public string? Comentario { get; set; }
}

public class CotizarRequestDto
{
    [Range(0.01, 50.0, ErrorMessage = "El peso debe estar entre 0.01 kg y 50.0 kg.")]
    public decimal PesoKg { get; set; }

    [Range(0.1, 5000.0, ErrorMessage = "La distancia debe ser mayor a 0.1 km.")]
    public decimal DistanciaKm { get; set; }
}

public class CotizarResponseDto
{
    public string NombreTarifa { get; set; } = string.Empty;
    public decimal PesoKg { get; set; }
    public decimal DistanciaKm { get; set; }
    public decimal PrecioBase { get; set; }
    public decimal PrecioPorKm { get; set; }
    public decimal CostoTotal { get; set; }
}

public class CrearEnvioRequestDto
{
    [Required, EmailAddress]
    public string CorreoReceptor { get; set; } = string.Empty;

    [Required]
    public string DireccionOrigen { get; set; } = string.Empty;

    [Required]
    public string DireccionDestino { get; set; } = string.Empty;

    [Required]
    public string DescripcionPaquete { get; set; } = string.Empty;

    [Range(0.01, 50.0)]
    public decimal PesoKg { get; set; }

    [Range(0.1, 5000.0)]
    public decimal DistanciaKm { get; set; }
}

public class ActualizarEstadoRequestDto
{
    [Range(1, 7, ErrorMessage = "El EstadoId debe corresponder a un estado válido del catálogo (1 al 7).")]
    public int NuevoEstadoId { get; set; }
    public string? Comentario { get; set; }
}

public class HistorialItemDto
{
    public int HistorialId { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string UsuarioCambio { get; set; } = string.Empty;
    public string? Comentario { get; set; }
    public DateTime FechaCambio { get; set; }
}

public class EnvioDetalleDto
{
    public int EnvioId { get; set; }
    public string CodigoRastreo { get; set; } = string.Empty;
    public int RemitenteId { get; set; }
    public string Remitente { get; set; } = string.Empty;
    public int? RepartidorId { get; set; }
    public string? Repartidor { get; set; }
    public int ReceptorId { get; set; }
    public string Receptor { get; set; } = string.Empty;
    public string DireccionOrigen { get; set; } = string.Empty;
    public string DireccionDestino { get; set; } = string.Empty;
    public string DescripcionPaquete { get; set; } = string.Empty;
    public decimal PesoKg { get; set; }
    public decimal DistanciaKm { get; set; }
    public decimal CostoTotal { get; set; }
    public int EstadoActualId { get; set; }
    public string EstadoActual { get; set; } = string.Empty;
    public string? RemitenteCorreo { get; set; }
    public string? ReceptorCorreo { get; set; }
    public DateTime FechaCreacion { get; set; }
    public List<HistorialItemDto> Historial { get; set; } = new();
}

public class EnvioCreadoDto
{
    public int EnvioId { get; set; }
    public string CodigoRastreo { get; set; } = string.Empty;
}

public class HistorialPublicoItemDto
{
    public string Estado { get; set; } = string.Empty;
    public string? Comentario { get; set; }
    public DateTime FechaCambio { get; set; }
}

public class EnvioRastreoPublicoDto
{
    public string CodigoRastreo { get; set; } = string.Empty;
    public int EstadoActualId { get; set; }
    public string EstadoActual { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
    public List<HistorialPublicoItemDto> Historial { get; set; } = new();
}

public class ResumenEstadoItemDto
{
    public int EstadoId { get; set; }
    public string Estado { get; set; } = string.Empty;
    public int Cantidad { get; set; }
}

public class ResumenEnviosDto
{
    public string Rol { get; set; } = string.Empty;
    public int TotalEnvios { get; set; }
    public int EnviosActivos { get; set; }
    public int EnviosEntregados { get; set; }
    public int EnviosCancelados { get; set; }
    public int EnviosConIncidencia { get; set; }
    public decimal MontoTotalOperado { get; set; }
    public decimal MontoEntregado { get; set; }
    public List<ResumenEstadoItemDto> DesglosePorEstado { get; set; } = new();
}

public class FiltroEnviosQueryDto
{
    public int? EstadoId { get; set; }
    public string? Busqueda { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La página debe ser mayor o igual a 1.")]
    public int Pagina { get; set; } = 1;

    [Range(1, 50, ErrorMessage = "El tamaño de página debe estar entre 1 y 50.")]
    public int TamanoPagina { get; set; } = 10;
}

public class EnviosPaginadosDto
{
    public int TotalRegistros { get; set; }
    public int PaginaActual { get; set; }
    public int TamanoPagina { get; set; }
    public int TotalPaginas { get; set; }
    public List<EnvioDetalleDto> Items { get; set; } = new();
}

public class EstadoPaqueteDto
{
    public int EstadoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
}

public class TarifaItemDto
{
    public int TarifaId { get; set; }
    public string NombreTarifa { get; set; } = string.Empty;
    public decimal PesoMinKg { get; set; }
    public decimal PesoMaxKg { get; set; }
    public decimal PrecioBase { get; set; }
    public decimal PrecioPorKm { get; set; }
}

public class ReceptorVerificadoDto
{
    public int UsuarioId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}