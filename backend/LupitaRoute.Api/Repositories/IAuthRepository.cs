using LupitaRoute.Api.Models;

namespace LupitaRoute.Api.Repositories;

public interface IAuthRepository
{
    Task<Usuario?> ObtenerPorCorreoAsync(string correo);
    Task<int> RegistrarUsuarioAsync(Usuario usuario);
}