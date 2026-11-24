using LupitaRoute.Api.DTOs;
using LupitaRoute.Api.Models;

namespace LupitaRoute.Api.Repositories;

public interface IEnvioRepository
{
    Task<TarifaEnvio?> ObtenerTarifaPorPesoAsync(decimal pesoKg);
    Task<int> CrearEnvioAsync(Envio envio);
    Task ActualizarEstadoAsync(int envioId, int nuevoEstadoId, int usuarioCambioId, string rolUsuario, string? comentario);
    Task<EnvioDetalleDto?> ObtenerPorCodigoRastreoAsync(string codigoRastreo);
    Task<IEnumerable<EnvioDetalleDto>> ObtenerEnviosPorUsuarioAsync(int usuarioId, string rol);
    Task<IEnumerable<EnvioDetalleDto>> ObtenerDisponiblesParaRepartidorAsync();
    Task<IEnumerable<dynamic>> ObtenerCatalogoEstadosAsync();
}