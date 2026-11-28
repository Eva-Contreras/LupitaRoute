# Nivel 3: Diagrama de componentes

```mermaid
flowchart LR
    spa["Aplicación web (SPA)<br/>React 19 + TypeScript"]
    db[("Base de datos<br/>SQL Server")]
    smtp["Servidor SMTP<br/>Correo externo"]

    subgraph api["LupitaRoute.Api (.NET 10)"]
        authCtrl["AuthController<br/>ASP.NET Controller<br/>Registro, inicio de sesión y perfil"]
        enviosCtrl["EnviosController<br/>ASP.NET Controller<br/>Cotización, guías, asignación, estados y rastreo"]
        healthCtrl["HealthController<br/>ASP.NET Controller<br/>Verificación de disponibilidad"]
        authSvc["AuthService<br/>C# Service<br/>Valida credenciales y genera tokens JWT"]
        envioSvc["EnvioService<br/>C# Service<br/>Reglas de tarifas, guías, permisos y estados"]
        emailSvc["EmailService<br/>C# Service<br/>Construye y envía notificaciones"]
        authRepo["AuthRepository<br/>C# Repository<br/>Usuarios y roles (stored procedures)"]
        envioRepo["EnvioRepository<br/>C# Repository<br/>Envíos, tarifas e historial (stored procedures)"]
    end

    spa -->|POST /api/Auth/register, POST /api/Auth/login, GET /api/Auth/me: JSON/HTTPS| authCtrl
    spa -->|GET/POST/PUT /api/Envios/*: JSON/HTTPS| enviosCtrl
    authCtrl -->|Usa| authSvc
    enviosCtrl -->|Usa| envioSvc
    authSvc -->|Usa| authRepo
    envioSvc -->|Usa| envioRepo
    envioSvc -->|Notifica cambios| emailSvc
    authRepo -->|Ejecuta consultas: SQL| db
    envioRepo -->|Ejecuta consultas: SQL| db
    emailSvc -->|Envía correo: SMTP| smtp
```