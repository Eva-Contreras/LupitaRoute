using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LupitaRoute.Api.DTOs;
using LupitaRoute.Api.Models;
using LupitaRoute.Api.Repositories;
using Microsoft.IdentityModel.Tokens;

namespace LupitaRoute.Api.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegistrarAsync(RegisterRequestDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto);
}

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IAuthRepository authRepository, IConfiguration configuration)
    {
        _authRepository = authRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegistrarAsync(RegisterRequestDto dto)
    {
        var existente = await _authRepository.ObtenerPorCorreoAsync(dto.Correo);
        if (existente != null)
            throw new InvalidOperationException("El correo ya está registrado.");

        var nuevoUsuario = new Usuario
        {
            NombreCompleto = dto.NombreCompleto,
            Correo = dto.Correo.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Telefono = dto.Telefono,
            RolId = dto.RolId
        };

        await _authRepository.RegistrarUsuarioAsync(nuevoUsuario);
        var usuarioCreado = await _authRepository.ObtenerPorCorreoAsync(nuevoUsuario.Correo)
            ?? throw new Exception("Error al recuperar el usuario recién registrado.");

        return GenerarRespuestaAuth(usuarioCreado);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var usuario = await _authRepository.ObtenerPorCorreoAsync(dto.Correo.Trim().ToLower());
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return null;

        return GenerarRespuestaAuth(usuario);
    }

    private AuthResponseDto GenerarRespuestaAuth(Usuario usuario)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Falta Jwt:Key.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioId.ToString()),
            new Claim(ClaimTypes.Email, usuario.Correo),
            new Claim(ClaimTypes.Role, usuario.RolNombre)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Usuario = new UsuarioResponseDto
            {
                UsuarioId = usuario.UsuarioId,
                NombreCompleto = usuario.NombreCompleto,
                Correo = usuario.Correo,
                Telefono = usuario.Telefono,
                RolId = usuario.RolId,
                Rol = usuario.RolNombre
            }
        };
    }
}