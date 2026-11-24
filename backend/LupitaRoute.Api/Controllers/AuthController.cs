using System.Security.Claims;
using LupitaRoute.Api.DTOs;
using LupitaRoute.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LupitaRoute.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        try
        {
            var resultado = await _authService.RegistrarAsync(dto);
            return Ok(resultado);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var resultado = await _authService.LoginAsync(dto);
        if (resultado == null)
            return Unauthorized(new { mensaje = "Correo o contraseña incorrectos." });

        return Ok(resultado);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> ObtenerPerfil()
    {
        int usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var perfil = await _authService.ObtenerPerfilAsync(usuarioId);
        if (perfil == null)
            return NotFound(new { mensaje = "Usuario no encontrado." });

        return Ok(perfil);
    }
}