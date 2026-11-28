using System.Net.Http.Json;

namespace LupitaRoute.Api.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private static readonly HttpClient _httpClient = new();

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task EnviarNotificacionEnvioAsync(
        string correoDestino,
        string nombreDestino,
        string codigoRastreo,
        string tituloEvento,
        string mensajeDetalle)
    {
        try
        {
            var apiKey = _config["Email:BrevoApiKey"];
            var remitenteNombre = _config["Email:RemitenteNombre"] ?? "LupitaRoute Paquetería";
            var remitenteCorreo = _config["Email:RemitenteCorreo"] ?? "lupitaroutes@gmail.com";

            if (string.IsNullOrWhiteSpace(apiKey))
                return;

            var htmlBody = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
                    <div style='background-color: #d6336c; color: white; padding: 20px; text-align: center;'>
                        <h2 style='margin: 0;'>LupitaRoute Paquetería</h2>
                    </div>
                    <div style='padding: 20px; color: #333;'>
                        <p>Hola <strong>{nombreDestino}</strong>,</p>
                        <h3 style='color: #d6336c;'>{tituloEvento}</h3>
                        <p>{mensajeDetalle}</p>
                        <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;'>
                            <span style='font-size: 12px; color: #666;'>Código de rastreo:</span><br/>
                            <strong style='font-size: 20px; letter-spacing: 1px;'>{codigoRastreo}</strong>
                        </div>
                        <p style='font-size: 12px; color: #888;'>Gracias por confiar en LupitaRoute.</p>
                    </div>
                </div>";

            var payload = new
            {
                sender = new { name = remitenteNombre, email = remitenteCorreo },
                to = new[]
                {
                    new
                    {
                        email = correoDestino,
                        name = string.IsNullOrWhiteSpace(nombreDestino) ? correoDestino : nombreDestino
                    }
                },
                subject = $"LupitaRoute ({codigoRastreo}) - {tituloEvento}",
                htmlContent = htmlBody
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
            request.Headers.Add("api-key", apiKey);
            request.Content = JsonContent.Create(payload);

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error enviando correo con Brevo: {ex.Message}");
        }
    }
}