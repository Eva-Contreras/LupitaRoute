using System.Security.Claims;
using LupitaRoute.Api.DTOs;
using LupitaRoute.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace LupitaRoute.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnviosController : ControllerBase
{
    private readonly IEnvioService _envioService;

    public EnviosController(IEnvioService envioService)
    {
        _envioService = envioService;
    }

    [HttpGet("estados")]
    public async Task<IActionResult> ObtenerEstados()
    {
        var estados = await _envioService.ObtenerCatalogoEstadosAsync();
        return Ok(estados);
    }

    [HttpPost("cotizar")]
    public async Task<IActionResult> Cotizar([FromBody] CotizarRequestDto dto)
    {
        try
        {
            var resultado = await _envioService.CotizarAsync(dto);
            return Ok(resultado);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [Authorize(Roles = "Remitente")]
    [HttpPost]
    public async Task<IActionResult> CrearEnvio([FromBody] CrearEnvioRequestDto dto)
    {
        try
        {
            int remitenteId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var envio = await _envioService.CrearEnvioAsync(remitenteId, dto);
            return Ok(envio);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("mis-envios")]
    public async Task<IActionResult> ObtenerMisEnvios([FromQuery] FiltroEnviosQueryDto filtro)
    {
        int usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        string rol = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        var resultado = await _envioService.ObtenerMisEnviosAsync(usuarioId, rol, filtro);
        return Ok(resultado);
    }

    [Authorize(Roles = "Repartidor")]
    [HttpGet("disponibles")]
    public async Task<IActionResult> ObtenerDisponibles()
    {
        var envios = await _envioService.ObtenerDisponiblesAsync();
        return Ok(envios);
    }

    [Authorize]
    [HttpGet("rastreo/{codigo}")]
    public async Task<IActionResult> Rastrear(string codigo)
    {
        try
        {
            int usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var envio = await _envioService.RastrearConPermisosAsync(codigo, usuarioId);
            if (envio == null)
                return NotFound(new { mensaje = $"No se encontró ningún envío con el código {codigo}." });

            return Ok(envio);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { mensaje = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpGet("rastreo/publico/{codigo}")]
    public async Task<IActionResult> RastrearPublico(string codigo)
    {
        var envio = await _envioService.RastrearPublicoAsync(codigo);
        if (envio == null)
            return NotFound(new { mensaje = $"No se encontró ningún envío con el código {codigo}." });

        return Ok(envio);
    }

    [Authorize]
    [HttpPut("{envioId:int}/estado")]
    public async Task<IActionResult> ActualizarEstado(int envioId, [FromBody] ActualizarEstadoRequestDto dto)
    {
        try
        {
            int usuarioCambioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            string rol = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

            await _envioService.ActualizarEstadoAsync(envioId, usuarioCambioId, rol, dto);
            return Ok(new { mensaje = "Estado actualizado correctamente." });
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [Authorize(Roles = "Repartidor")]
    [HttpPut("{envioId:int}/asignar")]
    public async Task<IActionResult> AsignarEnvio(int envioId, [FromBody] AsignarEnvioRequestDto? dto = null)
    {
        try
        {
            int repartidorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var envioActualizado = await _envioService.AsignarEnvioAsync(envioId, repartidorId, dto?.Comentario);
            return Ok(envioActualizado);
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("resumen")]
    public async Task<IActionResult> ObtenerResumen()
    {
        try
        {
            int usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            string rol = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

            var resumen = await _envioService.ObtenerResumenAsync(usuarioId, rol);
            return Ok(resumen);
        }
        catch (SqlException ex) when (ex.Number >= 50000)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
    [HttpGet("tarifas")]
    public async Task<IActionResult> ObtenerTarifas()
    {
        var tarifas = await _envioService.ObtenerTarifasAsync();
        return Ok(tarifas);
    }

    [Authorize(Roles = "Remitente")]
    [HttpGet("verificar-receptor")]
    public async Task<IActionResult> VerificarReceptor([FromQuery] string correo)
    {
        try
        {
            int remitenteId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var receptor = await _envioService.VerificarReceptorAsync(correo, remitenteId);

            if (receptor == null)
                return NotFound(new { mensaje = "No existe ningún usuario registrado con ese correo." });

            return Ok(receptor);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}