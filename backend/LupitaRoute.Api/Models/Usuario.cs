namespace LupitaRoute.Api.Models;

public class Usuario
{
    public int UsuarioId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public int RolId { get; set; }
    public string RolNombre { get; set; } = string.Empty;
}