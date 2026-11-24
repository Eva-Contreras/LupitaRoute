using LupitaRoute.Api.DTOs;

namespace LupitaRoute.Api.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegistrarAsync(RegisterRequestDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto);
    Task<UsuarioResponseDto?> ObtenerPerfilAsync(int usuarioId);
}