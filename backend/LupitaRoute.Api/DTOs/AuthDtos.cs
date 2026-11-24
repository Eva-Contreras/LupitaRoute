using System.ComponentModel.DataAnnotations;

namespace LupitaRoute.Api.DTOs;

public class RegisterRequestDto
{
    [Required]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Correo { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    [Range(1, 3, ErrorMessage = "El RolId debe ser 1 (Remitente), 2 (Repartidor) o 3 (Receptor).")]
    public int RolId { get; set; }
}

public class LoginRequestDto
{
    [Required, EmailAddress]
    public string Correo { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class UsuarioResponseDto
{
    public int UsuarioId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public int RolId { get; set; }
    public string Rol { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UsuarioResponseDto Usuario { get; set; } = new();
}