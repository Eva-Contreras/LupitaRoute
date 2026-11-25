using LupitaRoute.Api.DTOs;
using LupitaRoute.Api.Models;
using LupitaRoute.Api.Repositories;

namespace LupitaRoute.Api.Services;

public class EnvioService : IEnvioService
{
    private readonly IEnvioRepository _envioRepository;
    private readonly IAuthRepository _authRepository;

    public EnvioService(IEnvioRepository envioRepository, IAuthRepository authRepository)
    {
        _envioRepository = envioRepository;
        _authRepository = authRepository;
    }

    public async Task<CotizarResponseDto> CotizarAsync(CotizarRequestDto dto)
    {
        var tarifa = await _envioRepository.ObtenerTarifaPorPesoAsync(dto.PesoKg)
            ?? throw new InvalidOperationException("No existe una tarifa configurada para ese peso.");

        decimal costoTotal = Math.Round(tarifa.PrecioBase + (tarifa.PrecioPorKm * dto.DistanciaKm), 2);

        return new CotizarResponseDto
        {
            NombreTarifa = tarifa.NombreTarifa,
            PesoKg = dto.PesoKg,
            DistanciaKm = dto.DistanciaKm,
            PrecioBase = tarifa.PrecioBase,
            PrecioPorKm = tarifa.PrecioPorKm,
            CostoTotal = costoTotal
        };
    }

    public async Task<EnvioDetalleDto> CrearEnvioAsync(int remitenteId, CrearEnvioRequestDto dto)
    {
        var receptor = await _authRepository.ObtenerPorCorreoAsync(dto.CorreoReceptor.Trim().ToLower())
            ?? throw new InvalidOperationException("No se encontró ningún usuario registrado con el correo del receptor.");

        if (receptor.UsuarioId == remitenteId)
            throw new InvalidOperationException("No puedes registrarte a ti mismo como receptor del envío.");

        var cotizacion = await CotizarAsync(new CotizarRequestDto
        {
            PesoKg = dto.PesoKg,
            DistanciaKm = dto.DistanciaKm
        });

        var nuevoEnvio = new Envio
        {
            RemitenteId = remitenteId,
            ReceptorId = receptor.UsuarioId,
            DireccionOrigen = dto.DireccionOrigen,
            DireccionDestino = dto.DireccionDestino,
            DescripcionPaquete = dto.DescripcionPaquete,
            PesoKg = dto.PesoKg,
            DistanciaKm = dto.DistanciaKm,
            CostoTotal = cotizacion.CostoTotal
        };

        var creado = await _envioRepository.CrearEnvioAsync(nuevoEnvio);
        return await _envioRepository.ObtenerPorCodigoRastreoAsync(creado.CodigoRastreo)
            ?? throw new Exception("Error al recuperar el envío recién creado.");
    }

    public async Task ActualizarEstadoAsync(int envioId, int usuarioCambioId, string rolUsuario, ActualizarEstadoRequestDto dto)
    {
        await _envioRepository.ActualizarEstadoAsync(envioId, dto.NuevoEstadoId, usuarioCambioId, rolUsuario, dto.Comentario);
    }

    public async Task<EnvioDetalleDto?> RastrearConPermisosAsync(string codigoRastreo, int usuarioId)
    {
        var envio = await _envioRepository.ObtenerPorCodigoRastreoAsync(codigoRastreo.Trim().ToUpper());
        if (envio == null) return null;

        bool esInvolucrado = envio.RemitenteId == usuarioId
            || envio.ReceptorId == usuarioId
            || (envio.RepartidorId.HasValue && envio.RepartidorId.Value == usuarioId);

        if (!esInvolucrado)
            throw new UnauthorizedAccessException("No tienes permiso para ver los detalles privados de este envío.");

        return envio;
    }

    public async Task<EnvioRastreoPublicoDto?> RastrearPublicoAsync(string codigoRastreo)
    {
        return await _envioRepository.ObtenerPublicoPorCodigoRastreoAsync(codigoRastreo.Trim().ToUpper());
    }

    public async Task<EnviosPaginadosDto> ObtenerMisEnviosAsync(int usuarioId, string rol, FiltroEnviosQueryDto filtro)
    {
        return await _envioRepository.ObtenerEnviosPorUsuarioAsync(usuarioId, rol, filtro);
    }

    public async Task<IEnumerable<EnvioDetalleDto>> ObtenerDisponiblesAsync()
    {
        return await _envioRepository.ObtenerDisponiblesParaRepartidorAsync();
    }

    public async Task<IEnumerable<dynamic>> ObtenerCatalogoEstadosAsync()
    {
        return await _envioRepository.ObtenerCatalogoEstadosAsync();
    }

    public async Task<EnvioDetalleDto> AsignarEnvioAsync(int envioId, int repartidorId, string? comentario = null)
    {
        string codigoRastreo = await _envioRepository.AsignarEnvioAsync(envioId, repartidorId, comentario);
        return await _envioRepository.ObtenerPorCodigoRastreoAsync(codigoRastreo)
            ?? throw new InvalidOperationException("No se encontró el envío después de asignarlo.");
    }

    public async Task<ResumenEnviosDto> ObtenerResumenAsync(int usuarioId, string rol)
    {
        return await _envioRepository.ObtenerResumenPorUsuarioAsync(usuarioId, rol);
    }
}