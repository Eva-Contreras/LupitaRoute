namespace LupitaRoute.Api.Models;

public class TarifaEnvio
{
    public int TarifaId { get; set; }
    public string NombreTarifa { get; set; } = string.Empty;
    public decimal PesoMinKg { get; set; }
    public decimal PesoMaxKg { get; set; }
    public decimal PrecioBase { get; set; }
    public decimal PrecioPorKm { get; set; }
}

public class Envio
{
    public int EnvioId { get; set; }
    public string CodigoRastreo { get; set; } = string.Empty;
    public int RemitenteId { get; set; }
    public int? RepartidorId { get; set; }
    public int ReceptorId { get; set; }
    public string DireccionOrigen { get; set; } = string.Empty;
    public string DireccionDestino { get; set; } = string.Empty;
    public string DescripcionPaquete { get; set; } = string.Empty;
    public decimal PesoKg { get; set; }
    public decimal DistanciaKm { get; set; }
    public decimal CostoTotal { get; set; }
    public int EstadoActualId { get; set; }
    public DateTime FechaCreacion { get; set; }
}