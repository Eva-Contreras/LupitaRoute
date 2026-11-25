namespace LupitaRoute.Api.Services;

public interface IEmailService
{
    Task EnviarNotificacionEnvioAsync(
        string correoDestino,
        string nombreDestino,
        string codigoRastreo,
        string tituloEvento,
        string mensajeDetalle);
}