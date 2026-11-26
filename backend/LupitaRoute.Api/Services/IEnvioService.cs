using LupitaRoute.Api.DTOs;

namespace LupitaRoute.Api.Services;

public interface IEnvioService
{
    Task<CotizarResponseDto> CotizarAsync(CotizarRequestDto dto);
    Task<EnvioDetalleDto> CrearEnvioAsync(int remitenteId, CrearEnvioRequestDto dto);
    Task ActualizarEstadoAsync(int envioId, int usuarioCambioId, string rolUsuario, ActualizarEstadoRequestDto dto);
    Task<EnvioDetalleDto?> RastrearConPermisosAsync(string codigoRastreo, int usuarioId);
    Task<EnvioRastreoPublicoDto?> RastrearPublicoAsync(string codigoRastreo);
    Task<EnviosPaginadosDto> ObtenerMisEnviosAsync(int usuarioId, string rol, FiltroEnviosQueryDto filtro);
    Task<EnvioDetalleDto> AsignarEnvioAsync(int envioId, int repartidorId, string? comentario = null);
    Task<IEnumerable<EnvioDetalleDto>> ObtenerDisponiblesAsync();
    Task<IEnumerable<EstadoPaqueteDto>> ObtenerCatalogoEstadosAsync();
    Task<ResumenEnviosDto> ObtenerResumenAsync(int usuarioId, string rol);
    Task<IEnumerable<TarifaItemDto>> ObtenerTarifasAsync();
    Task<ReceptorVerificadoDto?> VerificarReceptorAsync(string correo, int remitenteId);
}