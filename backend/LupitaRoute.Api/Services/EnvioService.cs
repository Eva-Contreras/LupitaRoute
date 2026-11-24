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

        var cotizacion = await CotizarAsync(new CotizarRequestDto
        {
            PesoKg = dto.PesoKg,
            DistanciaKm = dto.DistanciaKm
        });

        string codigoRastreo = $"LUP-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}";

        var nuevoEnvio = new Envio
        {
            CodigoRastreo = codigoRastreo,
            RemitenteId = remitenteId,
            ReceptorId = receptor.UsuarioId,
            DireccionOrigen = dto.DireccionOrigen,
            DireccionDestino = dto.DireccionDestino,
            DescripcionPaquete = dto.DescripcionPaquete,
            PesoKg = dto.PesoKg,
            DistanciaKm = dto.DistanciaKm,
            CostoTotal = cotizacion.CostoTotal
        };

        await _envioRepository.CrearEnvioAsync(nuevoEnvio);
        return await _envioRepository.ObtenerPorCodigoRastreoAsync(codigoRastreo)
            ?? throw new Exception("Error al recuperar el envío recién creado.");
    }

    public async Task ActualizarEstadoAsync(int envioId, int usuarioCambioId, string rolUsuario, ActualizarEstadoRequestDto dto)
    {
        await _envioRepository.ActualizarEstadoAsync(envioId, dto.NuevoEstadoId, usuarioCambioId, rolUsuario, dto.Comentario);
    }

    public async Task<EnvioDetalleDto?> RastrearAsync(string codigoRastreo)
    {
        return await _envioRepository.ObtenerPorCodigoRastreoAsync(codigoRastreo.Trim().ToUpper());
    }

    public async Task<IEnumerable<EnvioDetalleDto>> ObtenerMisEnviosAsync(int usuarioId, string rol)
    {
        return await _envioRepository.ObtenerEnviosPorUsuarioAsync(usuarioId, rol);
    }

    public async Task<IEnumerable<EnvioDetalleDto>> ObtenerDisponiblesAsync()
    {
        return await _envioRepository.ObtenerDisponiblesParaRepartidorAsync();
    }

    public async Task<IEnumerable<dynamic>> ObtenerCatalogoEstadosAsync()
    {
        return await _envioRepository.ObtenerCatalogoEstadosAsync();
    }
}