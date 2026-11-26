using LupitaRoute.Api.Models;

namespace LupitaRoute.Api.Repositories;

public interface IAuthRepository
{
    Task<Usuario?> ObtenerPorCorreoAsync(string correo);
    Task<Usuario?> ObtenerPorIdAsync(int usuarioId);
    Task<int> RegistrarUsuarioAsync(Usuario usuario);
}