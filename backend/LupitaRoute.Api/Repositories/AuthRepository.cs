using System.Data;
using Dapper;
using LupitaRoute.Api.Models;
using Microsoft.Data.SqlClient;

namespace LupitaRoute.Api.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly string _connectionString;

    public AuthRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("No se encontró DefaultConnection.");
    }

    public async Task<Usuario?> ObtenerPorCorreoAsync(string correo)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<Usuario>(
            "sp_ObtenerUsuarioPorCorreo",
            new { Correo = correo },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> RegistrarUsuarioAsync(Usuario usuario)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.ExecuteScalarAsync<int>(
            "sp_RegistrarUsuario",
            new
            {
                usuario.NombreCompleto,
                usuario.Correo,
                usuario.PasswordHash,
                usuario.Telefono,
                usuario.RolId
            },
            commandType: CommandType.StoredProcedure
        );
    }
}