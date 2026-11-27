# LupitaRoute

Plataforma web integral para la gestión, cotización y rastreo en tiempo real de envíos y paquetería. Permite a los remitentes calcular tarifas y generar guías de envío, a los repartidores actualizar el estado y ubicación de los paquetes asignados, y a los receptores consultar el historial cronológico de sus entregas mediante un código de rastreo.

## Integrantes y Roles
* **Eva Guadalupe Contreras Antúnez** (`23100150`) — Frontend y DevOps
* **Karely Guadalupe Hernández Navarro** (`23100169`) — Backend y Base de Datos
* **Materia:** Tópicos Avanzados de Programación (Instituto Tecnológico de Nuevo Laredo)
* **Docente:** Ing. Jaime Sebastián Tenorio Ríos

---

## Enlaces Desplegados
- **Aplicación Web (Frontend):** https://lupita-route.vercel.app
- **API REST (Backend):** https://lupitaroutes.runasp.net

---

## Arquitectura del Sistema (Modelo C4)

La documentación visual de la arquitectura se encuentra en la carpeta `docs/modelo-c4/`:
1. **[Nivel 1: Diagrama de Contexto](docs/modelo-c4/context-diagram.md)** — Interacción entre Remitentes, Repartidores, Receptores, LupitaRoute y el servicio externo de correo (SMTP).
2. **[Nivel 2: Diagrama de Contenedores](docs/modelo-c4/container-diagram.md)** — Comunicación entre la SPA (React 19 + TypeScript), la Web API (ASP.NET Core .NET 10) y SQL Server.
3. **[Nivel 3: Diagrama de Componentes](docs/modelo-c4/component-diagram.md)** — Organización interna de controladores, servicios y repositorios en la API.
4. **[Nivel 4: Diagrama de Código](docs/modelo-c4/code-diagram.md)** — Estructura de clases e interfaces del módulo principal de envíos.

---

## Stack Tecnológico
* **Frontend:** React 19, TypeScript, Vite, CSS modular.
* **Backend:** ASP.NET Core Web API (.NET 10), autenticación con JWT (JSON Web Tokens).
* **Base de Datos:** SQL Server.
* **CI/CD:** GitHub Actions (validación automática de lint y compilación en `develop` y `main`).

---

## Patrones de Diseño y Buenas Prácticas Aplicadas

| Patrón / Práctica | Ubicación en el Proyecto | Problema que Resuelve |
| :--- | :--- | :--- |
| **Repository Pattern** | `backend/LupitaRoute.Api/Repositories/` (`IEnvioRepository`, `EnvioRepository`, `IAuthRepository`, `AuthRepository`) | Desacopla la lógica de negocio del acceso directo a SQL Server, centralizando las consultas y facilitando el mantenimiento. |
| **Dependency Injection (DI)** | `backend/LupitaRoute.Api/Program.cs`, Controladores y Servicios (`IEnvioService`, `IAuthService`, `IEmailService`) | Evita el acoplamiento fuerte entre clases mediante la inversión de control nativa de ASP.NET Core, permitiendo inyectar interfaces en tiempo de ejecución. |
| **DTO (Data Transfer Object)** | `backend/LupitaRoute.Api/DTOs/` (`AuthDtos.cs`, `EnvioDtos.cs`) | Separa los modelos internos de base de datos de los contratos JSON expuestos en la API, protegiendo campos sensibles y validando entradas. |
| **Service Layer** | `backend/LupitaRoute.Api/Services/` (`EnvioService.cs`, `AuthService.cs`, `EmailService.cs`) | Encapsula las reglas de negocio (cálculo de tarifas, generación de guías `LUP-2026-XXXX`, validaciones de cambio de estado y envío de correos) fuera de los controladores. |
| **Custom Hooks & Service Abstraction** | `frontend/src/hooks/` (`useEnvios.ts`, `useEntregas.ts`, `useListaEnvios.ts`) y `frontend/src/services/` | Separa la lógica de consumo HTTP y manejo de estado de los componentes visuales de React, reutilizando la lógica de filtrado, paginación y autenticación. |

---

## Registro de usuarios

Los receptores pueden registrarse desde el inicio de sesión. Los remitentes y repartidores pueden crear cuentas de su mismo rol desde el botón superior de su panel, sin cerrar su sesión.

Esta separación se aplica únicamente en la interfaz: la API actual permite registrar cualquiera de los tres roles sin autenticación. Para hacerla efectiva como medida de seguridad, es necesario restringir el registro también en el backend.

## Ejecución Local

### Requisitos previos
* Node.js 22 o superior
* .NET SDK 10.0
* SQL Server (local o en contenedor)

### 1. Base de Datos
1. Crea una base de datos llamada `LupitaRouteDb` en tu instancia de SQL Server.
2. Ejecuta el script de creación de tablas y catálogos ubicado en `docs/database.sql`.

### 2. Backend (ASP.NET Core Web API)
Las credenciales y cadenas de conexión se gestionan mediante `dotnet user-secrets` para mantenerlas fuera del repositorio:

```bash
cd backend/LupitaRoute.Api

# Configurar secretos locales
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=LupitaRouteDb;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets set "Jwt:Key" "ClaveSecretaSuperSeguraDeAlMenos32Caracteres!"

# Restaurar dependencias y ejecutar
dotnet restore
dotnet run