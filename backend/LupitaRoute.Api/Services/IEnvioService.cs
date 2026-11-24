using LupitaRoute.Api.DTOs;

namespace LupitaRoute.Api.Services;

public interface IEnvioService
{
    Task<CotizarResponseDto> CotizarAsync(CotizarRequestDto dto);
    Task<EnvioDetalleDto> CrearEnvioAsync(int remitenteId, CrearEnvioRequestDto dto);
    Task ActualizarEstadoAsync(int envioId, int usuarioCambioId, ActualizarEstadoRequestDto dto);
    Task<EnvioDetalleDto?> RastrearAsync(string codigoRastreo);
    Task<IEnumerable<EnvioDetalleDto>> ObtenerMisEnviosAsync(int usuarioId, string rol);
    Task<IEnumerable<EnvioDetalleDto>> ObtenerDisponiblesAsync();
    Task<IEnumerable<dynamic>> ObtenerCatalogoEstadosAsync();
}