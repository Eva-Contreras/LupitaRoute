using LupitaRoute.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LupitaRoute.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IEnvioService _envioService;

    public HealthController(IEnvioService envioService)
    {
        _envioService = envioService;
    }

    [HttpGet]
    public async Task<IActionResult> Check()
    {
        try
        {
            var estados = await _envioService.ObtenerCatalogoEstadosAsync();
            return Ok(new
            {
                status = "Healthy",
                database = "Connected",
                estadosCount = estados.Count(),
                timestampUtc = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new
            {
                status = "Unhealthy",
                database = "Disconnected",
                error = ex.Message
            });
        }
    }
    
}