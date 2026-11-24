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

    public async Task<int> CrearEnvioAsync(Envio envio)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.ExecuteScalarAsync<int>(
            "sp_CrearEnvio",
            new
            {
                envio.CodigoRastreo,
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

    public async Task ActualizarEstadoAsync(int envioId, int nuevoEstadoId, int usuarioCambioId, string? comentario)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_ActualizarEstadoEnvio",
            new
            {
                EnvioId = envioId,
                NuevoEstadoId = nuevoEstadoId,
                UsuarioCambioId = usuarioCambioId,
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
}