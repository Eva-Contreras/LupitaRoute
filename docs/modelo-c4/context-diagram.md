# Nivel 1: Diagrama de contexto

```mermaid
flowchart LR
    remitente["Persona: Remitente<br/>Cotiza envíos, crea guías y consulta su panel"]
    repartidor["Persona: Repartidor<br/>Consulta envíos disponibles, se los asigna y actualiza su estado"]
    receptor["Persona: Receptor<br/>Consulta sus envíos y rastrea paquetes con el código de guía"]
    lupita["Sistema: LupitaRoute<br/>Plataforma web para gestión, cotización y rastreo de paquetería"]
    smtp["Sistema externo: Servicio de correo (SMTP)<br/>Envía notificaciones de seguimiento por email"]

    remitente -->|Crea guías y cotiza envíos| lupita
    repartidor -->|Se asigna envíos y actualiza estados| lupita
    receptor -->|Consulta estado e historial de envíos| lupita
    lupita -->|Envía notificaciones: SMTP| smtp
```
