using System.Data;
using Dapper;
using LupitaRoute.Api.DTOs;
using LupitaRoute.Api.Models;
using Microsoft.Data.SqlClient;

namespace LupitaRoute.Api.Repositories;

public class EnvioRepository : IEnvioRepository
{
    private readonly string _connectionString;

    public EnvioRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("No se encontró DefaultConnection.");
    }

    public async Task<TarifaEnvio?> ObtenerTarifaPorPesoAsync(decimal pesoKg)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<TarifaEnvio>(
            "sp_ObtenerTarifaPorPeso",
            new { PesoKg = pesoKg },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<EnvioCreadoDto> CrearEnvioAsync(Envio envio)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleAsync<EnvioCreadoDto>(
            "sp_CrearEnvio",
            new
            {
                envio.RemitenteId,
                envio.ReceptorId,
                envio.DireccionOrigen,
                envio.DireccionDestino,
                envio.DescripcionPaquete,
                envio.PesoKg,
                envio.DistanciaKm,
                envio.CostoTotal
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task ActualizarEstadoAsync(int envioId, int nuevoEstadoId, int usuarioCambioId, string rolUsuario, string? comentario)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_ActualizarEstadoEnvio",
            new
            {
                EnvioId = envioId,
                NuevoEstadoId = nuevoEstadoId,
                UsuarioCambioId = usuarioCambioId,
                RolUsuario = rolUsuario,
                Comentario = comentario
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<EnvioDetalleDto?> ObtenerPorCodigoRastreoAsync(string codigoRastreo)
    {
        using var connection = new SqlConnection(_connectionString);
        using var multi = await connection.QueryMultipleAsync(
            "sp_ObtenerEnvioPorCodigo",
            new { CodigoRastreo = codigoRastreo },
            commandType: CommandType.StoredProcedure
        );

        var envio = await multi.ReadFirstOrDefaultAsync<EnvioDetalleDto>();
        if (envio == null) return null;

        var historial = await multi.ReadAsync<HistorialItemDto>();
        envio.Historial = historial.ToList();
        return envio;
    }

    public async Task<EnvioRastreoPublicoDto?> ObtenerPublicoPorCodigoRastreoAsync(string codigoRastreo)
    {
        using var connection = new SqlConnection(_connectionString);
        using var multi = await connection.QueryMultipleAsync(
            "sp_ObtenerEnvioPublicoPorCodigo",
            new { CodigoRastreo = codigoRastreo },
            commandType: CommandType.StoredProcedure
        );

        var envio = await multi.ReadFirstOrDefaultAsync<EnvioRastreoPublicoDto>();
        if (envio == null) return null;

        var historial = await multi.ReadAsync<HistorialPublicoItemDto>();
        envio.Historial = historial.ToList();
        return envio;
    }

    public async Task<IEnumerable<EnvioDetalleDto>> ObtenerEnviosPorUsuarioAsync(int usuarioId, string rol)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<EnvioDetalleDto>(
            "sp_ObtenerEnviosPorUsuario",
            new { UsuarioId = usuarioId, Rol = rol },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<EnvioDetalleDto>> ObtenerDisponiblesParaRepartidorAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<EnvioDetalleDto>(
            "sp_ObtenerEnviosDisponibles",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<dynamic>> ObtenerCatalogoEstadosAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync(
            "sp_ObtenerEstadosPaquete",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<string> AsignarEnvioAsync(int envioId, int repartidorId, string? comentario)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.ExecuteScalarAsync<string>(
            "sp_AsignarEnvio",
            new
            {
                EnvioId = envioId,
                RepartidorId = repartidorId,
                Comentario = comentario
            },
            commandType: CommandType.StoredProcedure
        ) ?? throw new InvalidOperationException("No se pudo recuperar el código de rastreo tras asignar el envío.");
    }
    public async Task<ResumenEnviosDto> ObtenerResumenPorUsuarioAsync(int usuarioId, string rol)
    {
        using var connection = new SqlConnection(_connectionString);
        using var multi = await connection.QueryMultipleAsync(
            "sp_ObtenerResumenEnvios",
            new { UsuarioId = usuarioId, Rol = rol },
            commandType: CommandType.StoredProcedure
        );

        var resumen = await multi.ReadFirstAsync<ResumenEnviosDto>();
        var desglose = await multi.ReadAsync<ResumenEstadoItemDto>();
        resumen.DesglosePorEstado = desglose.ToList();
        return resumen;
    }
}