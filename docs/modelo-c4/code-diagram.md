# Nivel 4: Diagrama de código - Módulo de envíos

```mermaid
classDiagram
    class EnviosController {
        -IEnvioService _envioService
        +Cotizar(CotizacionRequest) IActionResult
        +ObtenerEnvios() IActionResult
        +ObtenerPorCodigo(string codigo) IActionResult
        +CrearEnvio(CrearEnvioRequest) IActionResult
        +ActualizarEstado(int id, ActualizarEstadoDto) IActionResult
    }

    class IEnvioService {
        <<interface>>
        +CalcularCotizacion(CotizacionRequest) CotizacionResponse
        +ObtenerEnviosPorUsuario(int usuarioId, string rol) List~Envio~
        +CrearEnvio(int remitenteId, CrearEnvioRequest) Envio
        +CambiarEstado(int envioId, int repartidorId, ActualizarEstadoDto) bool
    }

    class EnvioService {
        -IEnvioRepository _repository
        -IEmailService _emailService
        +CalcularCotizacion(CotizacionRequest) CotizacionResponse
        +ObtenerEnviosPorUsuario(int usuarioId, string rol) List~Envio~
        +CrearEnvio(int remitenteId, CrearEnvioRequest) Envio
        +CambiarEstado(int envioId, int repartidorId, ActualizarEstadoDto) bool
    }

    class IEnvioRepository {
        <<interface>>
        +ObtenerTarifa(string origen, string destino) TarifaEnvio
        +InsertarEnvio(Envio) Envio
        +ActualizarEstadoYHistorial(int envioId, HistorialEstado) bool
    }

    class EnvioRepository {
        -string _connectionString
        +ObtenerTarifa(string origen, string destino) TarifaEnvio
        +InsertarEnvio(Envio) Envio
        +ActualizarEstadoYHistorial(int envioId, HistorialEstado) bool
    }

    EnviosController --> IEnvioService : depende de
    EnvioService ..|> IEnvioService : implementa
    EnvioService --> IEnvioRepository : depende de
    EnvioRepository ..|> IEnvioRepository : implementa
```