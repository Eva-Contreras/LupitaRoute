using LupitaRoute.Api.DTOs;
using LupitaRoute.Api.Models;

namespace LupitaRoute.Api.Repositories;

public interface IEnvioRepository
{
    Task<TarifaEnvio?> ObtenerTarifaPorPesoAsync(decimal pesoKg);
    Task<EnvioCreadoDto> CrearEnvioAsync(Envio envio);
    Task<string> ActualizarEstadoAsync(int envioId, int nuevoEstadoId, int usuarioCambioId, string rolUsuario, string? comentario);
    Task<EnvioDetalleDto?> ObtenerPorCodigoRastreoAsync(string codigoRastreo);
    Task<EnvioRastreoPublicoDto?> ObtenerPublicoPorCodigoRastreoAsync(string codigoRastreo);
    Task<EnviosPaginadosDto> ObtenerEnviosPorUsuarioAsync(int usuarioId, string rol, FiltroEnviosQueryDto filtro);
    Task<string> AsignarEnvioAsync(int envioId, int repartidorId, string? comentario);
    Task<IEnumerable<EnvioDetalleDto>> ObtenerDisponiblesParaRepartidorAsync();
    Task<IEnumerable<EstadoPaqueteDto>> ObtenerCatalogoEstadosAsync();
    Task<ResumenEnviosDto> ObtenerResumenPorUsuarioAsync(int usuarioId, string rol);
    Task<IEnumerable<TarifaItemDto>> ObtenerTarifasAsync();
    Task<ReceptorVerificadoDto?> VerificarReceptorPorCorreoAsync(string correo);
}