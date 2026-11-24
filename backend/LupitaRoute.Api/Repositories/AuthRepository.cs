using Dapper;
using LupitaRoute.Api.Models;
using Microsoft.Data.SqlClient;

namespace LupitaRoute.Api.Repositories;

public interface IAuthRepository
{
    Task<Usuario?> ObtenerPorCorreoAsync(string correo);
    Task<int> RegistrarUsuarioAsync(Usuario usuario);
}

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
        const string sql = @"
            SELECT u.UsuarioId, u.NombreCompleto, u.Correo, u.PasswordHash, 
                   u.Telefono, u.RolId, r.Nombre AS RolNombre
            FROM Usuarios u
            INNER JOIN Roles r ON u.RolId = r.RolId
            WHERE u.Correo = @Correo;";

        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Correo = correo });
    }

    public async Task<int> RegistrarUsuarioAsync(Usuario usuario)
    {
        const string sql = @"
            INSERT INTO Usuarios (NombreCompleto, Correo, PasswordHash, Telefono, RolId)
            OUTPUT INSERTED.UsuarioId
            VALUES (@NombreCompleto, @Correo, @PasswordHash, @Telefono, @RolId);";

        using var connection = new SqlConnection(_connectionString);
        return await connection.ExecuteScalarAsync<int>(sql, usuario);
    }
}