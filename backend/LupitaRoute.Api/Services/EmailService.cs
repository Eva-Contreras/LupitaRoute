using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace LupitaRoute.Api.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task EnviarNotificacionEnvioAsync(
        string correoDestino,
        string nombreDestino,
        string codigoRastreo,
        string tituloEvento,
        string mensajeDetalle)
    {
        var host = _config["Email:Host"];
        var remCorreo = _config["Email:RemitenteCorreo"];
        var password = _config["Email:Password"];

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(remCorreo) || string.IsNullOrWhiteSpace(password))
            return;

        try
        {
            var mensaje = new MimeMessage();
            mensaje.From.Add(new MailboxAddress(_config["Email:RemitenteNombre"] ?? "LupitaRoute", remCorreo));
            mensaje.To.Add(new MailboxAddress(nombreDestino, correoDestino));
            mensaje.Subject = $"[LupitaRoute] {tituloEvento} - {codigoRastreo}";

            mensaje.Body = new TextPart("html")
            {
                Text = $@"
                <div style='font-family: Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;'>
                    <h2 style='color: #1d4ed8; margin-top: 0;'>LupitaRoute - Actualización de Envío</h2>
                    <p>Hola <strong>{nombreDestino}</strong>,</p>
                    <p>{mensajeDetalle}</p>
                    <div style='background: #f3f4f6; padding: 12px; border-radius: 6px; margin: 16px 0;'>
                        <strong>Código de rastreo:</strong> <span style='font-family: monospace; font-size: 16px;'>{codigoRastreo}</span>
                    </div>
                    <p style='font-size: 12px; color: #6b7280;'>Este es un mensaje automático de LupitaRoute.</p>
                </div>"
            };

            using var client = new MailKit.Net.Smtp.SmtpClient();
            int port = int.TryParse(_config["Email:Port"], out var p) ? p : 587;
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(remCorreo, password);
            await Task.Run(() => client.Send(mensaje));
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "No se pudo enviar el correo de notificación para {Codigo}", codigoRastreo);
        }
    }
}