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