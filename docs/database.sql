-- Ejecutar este script dentro de la base de datos LupitaRouteDb previamente creada.
USE [LupitaRouteDb]
GO
/****** Objeto: Sequence [dbo].[SeqCodigoRastreo] Fecha de script: 26/11/2026 09:45:15 a. m. ******/
CREATE SEQUENCE [dbo].[SeqCodigoRastreo] 
 AS [int]
 START WITH 1
 INCREMENT BY 1
 MINVALUE 1
 MAXVALUE 2147483647
 CACHE 
GO
/****** Objeto: Table [dbo].[Envios] Fecha de script: 26/11/2026 09:45:15 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Envios](
	[EnvioId] [int] IDENTITY(1,1) NOT NULL,
	[CodigoRastreo] [nvarchar](20) NOT NULL,
	[RemitenteId] [int] NOT NULL,
	[RepartidorId] [int] NULL,
	[ReceptorId] [int] NOT NULL,
	[DireccionOrigen] [nvarchar](255) NOT NULL,
	[DireccionDestino] [nvarchar](255) NOT NULL,
	[DescripcionPaquete] [nvarchar](255) NOT NULL,
	[PesoKg] [decimal](10, 2) NOT NULL,
	[DistanciaKm] [decimal](10, 2) NOT NULL,
	[CostoTotal] [decimal](10, 2) NOT NULL,
	[EstadoActualId] [int] NOT NULL,
	[FechaCreacion] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[EnvioId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[EstadosPaquete] Fecha de script: 26/11/2026 09:45:15 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EstadosPaquete](
	[EstadoId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[Descripcion] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[EstadoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[HistorialEstados] Fecha de script: 26/11/2026 09:45:15 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HistorialEstados](
	[HistorialId] [int] IDENTITY(1,1) NOT NULL,
	[EnvioId] [int] NOT NULL,
	[EstadoId] [int] NOT NULL,
	[UsuarioCambioId] [int] NOT NULL,
	[Comentario] [nvarchar](255) NULL,
	[FechaCambio] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[HistorialId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Roles] Fecha de script: 26/11/2026 09:45:15 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RolId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RolId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[TarifasEnvio] Fecha de script: 26/11/2026 09:45:15 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TarifasEnvio](
	[TarifaId] [int] IDENTITY(1,1) NOT NULL,
	[NombreTarifa] [nvarchar](100) NOT NULL,
	[PesoMinKg] [decimal](10, 2) NOT NULL,
	[PesoMaxKg] [decimal](10, 2) NOT NULL,
	[PrecioBase] [decimal](10, 2) NOT NULL,
	[PrecioPorKm] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TarifaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Usuarios] Fecha de script: 26/11/2026 09:45:15 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[UsuarioId] [int] IDENTITY(1,1) NOT NULL,
	[NombreCompleto] [nvarchar](150) NOT NULL,
	[Correo] [nvarchar](150) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Telefono] [nvarchar](20) NULL,
	[RolId] [int] NOT NULL,
	[FechaRegistro] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UsuarioId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Envios] ON 

INSERT [dbo].[Envios] ([EnvioId], [CodigoRastreo], [RemitenteId], [RepartidorId], [ReceptorId], [DireccionOrigen], [DireccionDestino], [DescripcionPaquete], [PesoKg], [DistanciaKm], [CostoTotal], [EstadoActualId], [FechaCreacion]) VALUES (1, N'LUP-2026-8131', 2, 3, 2, N'Sierra del Grillo, 345, Colonia Las Flores', N'Venustiano Carranza, 1029, Colonia Azteca', N'Camisa personalizada', CAST(2.50 AS Decimal(10, 2)), CAST(300.00 AS Decimal(10, 2)), CAST(1910.00 AS Decimal(10, 2)), 4, CAST(N'2026-11-24T23:00:05.717' AS DateTime))
INSERT [dbo].[Envios] ([EnvioId], [CodigoRastreo], [RemitenteId], [RepartidorId], [ReceptorId], [DireccionOrigen], [DireccionDestino], [DescripcionPaquete], [PesoKg], [DistanciaKm], [CostoTotal], [EstadoActualId], [FechaCreacion]) VALUES (2, N'LUP-2026-8644', 2, 3, 5, N'Sierra del Grillo, 345, Colonia Las Flores', N'Calle Morita, 435, Colonia Viveros', N'Vestido de flores', CAST(1.00 AS Decimal(10, 2)), CAST(15.00 AS Decimal(10, 2)), CAST(132.50 AS Decimal(10, 2)), 1, CAST(N'2026-11-25T00:08:48.993' AS DateTime))
INSERT [dbo].[Envios] ([EnvioId], [CodigoRastreo], [RemitenteId], [RepartidorId], [ReceptorId], [DireccionOrigen], [DireccionDestino], [DescripcionPaquete], [PesoKg], [DistanciaKm], [CostoTotal], [EstadoActualId], [FechaCreacion]) VALUES (3, N'LUP-2026-3714', 2, NULL, 4, N'Sierra del Grillo, 345, Colonia Las Flores', N'Benito Juarez, 3901, Colonia Encinos', N'Cuaderno personalizado', CAST(0.50 AS Decimal(10, 2)), CAST(10.00 AS Decimal(10, 2)), CAST(110.00 AS Decimal(10, 2)), 1, CAST(N'2026-11-25T01:17:11.283' AS DateTime))
INSERT [dbo].[Envios] ([EnvioId], [CodigoRastreo], [RemitenteId], [RepartidorId], [ReceptorId], [DireccionOrigen], [DireccionDestino], [DescripcionPaquete], [PesoKg], [DistanciaKm], [CostoTotal], [EstadoActualId], [FechaCreacion]) VALUES (4, N'LUP-2026-0001', 2, NULL, 7, N'Av. Reforma 1200', N'Col. Guerrero 450', N'Documentos y accesorios', CAST(2.50 AS Decimal(10, 2)), CAST(8.00 AS Decimal(10, 2)), CAST(158.00 AS Decimal(10, 2)), 1, CAST(N'2026-11-25T18:26:27.170' AS DateTime))
SET IDENTITY_INSERT [dbo].[Envios] OFF
GO
SET IDENTITY_INSERT [dbo].[EstadosPaquete] ON 

INSERT [dbo].[EstadosPaquete] ([EstadoId], [Nombre], [Descripcion]) VALUES (1, N'Creado', N'El envío ha sido registrado y cotizado por el remitente.')
INSERT [dbo].[EstadosPaquete] ([EstadoId], [Nombre], [Descripcion]) VALUES (2, N'Recolectado', N'El repartidor ha recogido el paquete en el punto de origen.')
INSERT [dbo].[EstadosPaquete] ([EstadoId], [Nombre], [Descripcion]) VALUES (3, N'En tránsito', N'El paquete se encuentra en traslado hacia la zona de destino.')
INSERT [dbo].[EstadosPaquete] ([EstadoId], [Nombre], [Descripcion]) VALUES (4, N'Entregado', N'El paquete fue recibido exitosamente por el receptor.')
INSERT [dbo].[EstadosPaquete] ([EstadoId], [Nombre], [Descripcion]) VALUES (5, N'Cancelado', N'El envío fue cancelado.')
INSERT [dbo].[EstadosPaquete] ([EstadoId], [Nombre], [Descripcion]) VALUES (6, N'En reparto', N'El repartidor va en ruta final para entregar el paquete al receptor.')
INSERT [dbo].[EstadosPaquete] ([EstadoId], [Nombre], [Descripcion]) VALUES (7, N'Incidencia', N'Ocurrió un problema durante el traslado o intento de entrega.')
SET IDENTITY_INSERT [dbo].[EstadosPaquete] OFF
GO
SET IDENTITY_INSERT [dbo].[HistorialEstados] ON 

INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (1, 1, 1, 2, N'Envío creado y cotizado.', CAST(N'2026-11-24T23:00:05.720' AS DateTime))
INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (2, 2, 1, 2, N'Envío creado y cotizado.', CAST(N'2026-11-25T00:08:48.993' AS DateTime))
INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (3, 1, 2, 3, NULL, CAST(N'2026-11-25T00:33:44.590' AS DateTime))
INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (4, 1, 3, 3, NULL, CAST(N'2026-11-25T00:34:02.533' AS DateTime))
INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (5, 3, 1, 2, N'Envío creado y cotizado.', CAST(N'2026-11-25T01:17:11.283' AS DateTime))
INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (6, 2, 1, 3, N'Envío asignado al repartidor.', CAST(N'2026-11-25T04:13:41.433' AS DateTime))
INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (7, 4, 1, 2, N'Envío creado y cotizado.', CAST(N'2026-11-25T18:26:27.173' AS DateTime))
INSERT [dbo].[HistorialEstados] ([HistorialId], [EnvioId], [EstadoId], [UsuarioCambioId], [Comentario], [FechaCambio]) VALUES (8, 1, 4, 3, NULL, CAST(N'2026-11-25T18:45:34.070' AS DateTime))
SET IDENTITY_INSERT [dbo].[HistorialEstados] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([RolId], [Nombre]) VALUES (3, N'Receptor')
INSERT [dbo].[Roles] ([RolId], [Nombre]) VALUES (1, N'Remitente')
INSERT [dbo].[Roles] ([RolId], [Nombre]) VALUES (2, N'Repartidor')
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[TarifasEnvio] ON 

INSERT [dbo].[TarifasEnvio] ([TarifaId], [NombreTarifa], [PesoMinKg], [PesoMaxKg], [PrecioBase], [PrecioPorKm]) VALUES (1, N'Sobre / Paquete Ligero', CAST(0.01 AS Decimal(10, 2)), CAST(2.00 AS Decimal(10, 2)), CAST(65.00 AS Decimal(10, 2)), CAST(4.50 AS Decimal(10, 2)))
INSERT [dbo].[TarifasEnvio] ([TarifaId], [NombreTarifa], [PesoMinKg], [PesoMaxKg], [PrecioBase], [PrecioPorKm]) VALUES (2, N'Paquete Estándar', CAST(2.01 AS Decimal(10, 2)), CAST(10.00 AS Decimal(10, 2)), CAST(110.00 AS Decimal(10, 2)), CAST(6.00 AS Decimal(10, 2)))
INSERT [dbo].[TarifasEnvio] ([TarifaId], [NombreTarifa], [PesoMinKg], [PesoMaxKg], [PrecioBase], [PrecioPorKm]) VALUES (3, N'Carga Pesada', CAST(10.01 AS Decimal(10, 2)), CAST(50.00 AS Decimal(10, 2)), CAST(220.00 AS Decimal(10, 2)), CAST(9.50 AS Decimal(10, 2)))
SET IDENTITY_INSERT [dbo].[TarifasEnvio] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuarios] ON 

INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (1, N'karely', N'herh@nfikgk', N'$2a$11$bSyD18LnVPz..17j6T.dAuCVpeGB9qR554iczYilPRZHgIC3YJ3AS', NULL, 1, CAST(N'2026-11-24T15:20:39.200' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (2, N'Eva', N'eva@correo', N'$2a$11$C1Bx43fcgUw75v4cXGdUueU/n8qzSqiMB4.53GL8tAHZMJpvRHoGO', N'12345678', 1, CAST(N'2026-11-24T19:36:03.393' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (3, N'Laura', N'laura@correo', N'$2a$11$CppxbOsCcAWgR6vfxNhYEeDMObluqdjZXdmaB9eWyA8fNUpt8lclW', NULL, 2, CAST(N'2026-11-24T20:00:01.050' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (4, N'Pedro', N'pedro@correo', N'$2a$11$DE3BlluWP8rhEkne.AD1d.xLmmiUWXUTj.sVchk7JOcSftkHcNCiO', NULL, 3, CAST(N'2026-11-24T20:01:32.993' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (5, N'Sofía', N'sofia@correo', N'$2a$11$I7D9Ew4DDS1LFe8nZeBtY.89LBpCMMCUM38yplgPtAtE4zrwgNuC.', NULL, 3, CAST(N'2026-11-25T00:07:31.320' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (6, N'Valeria Segovia', N'valeria@correo', N'$2a$11$TU9WslQQy6OmmEad9D7N7OupP9Bv8x5cdQB3/jB4wkYnnmRaDYlrG', NULL, 3, CAST(N'2026-11-25T15:04:46.650' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (7, N'karely h', N'karely@correo', N'$2a$11$k7rcIMP3DqWIEKF18DOtS.mA75Awg7eNpKjyEZq3R6a7vUEBZeSdS', NULL, 1, CAST(N'2026-11-25T18:23:43.803' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioId], [NombreCompleto], [Correo], [PasswordHash], [Telefono], [RolId], [FechaRegistro]) VALUES (8, N'José', N'jose@correo', N'$2a$11$DzecDv4VLqm3kkdSm8lG7eWTiMRkmKZ9N0zVgsNue5lysj7.yXaHC', NULL, 1, CAST(N'2026-11-26T16:34:21.473' AS DateTime))
SET IDENTITY_INSERT [dbo].[Usuarios] OFF
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__Envios__9A41B2856F900048] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
ALTER TABLE [dbo].[Envios] ADD UNIQUE NONCLUSTERED 
(
	[CodigoRastreo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__EstadosP__75E3EFCF0C827C3C] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
ALTER TABLE [dbo].[EstadosPaquete] ADD UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__Roles__75E3EFCF04602852] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__Usuarios__60695A1959943FFF] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
ALTER TABLE [dbo].[Usuarios] ADD UNIQUE NONCLUSTERED 
(
	[Correo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Envios] ADD  DEFAULT ((1)) FOR [EstadoActualId]
GO
ALTER TABLE [dbo].[Envios] ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[HistorialEstados] ADD  DEFAULT (getdate()) FOR [FechaCambio]
GO
ALTER TABLE [dbo].[Usuarios] ADD  DEFAULT (getdate()) FOR [FechaRegistro]
GO
ALTER TABLE [dbo].[Envios]  WITH CHECK ADD  CONSTRAINT [FK_Envios_Estado] FOREIGN KEY([EstadoActualId])
REFERENCES [dbo].[EstadosPaquete] ([EstadoId])
GO
ALTER TABLE [dbo].[Envios] CHECK CONSTRAINT [FK_Envios_Estado]
GO
ALTER TABLE [dbo].[Envios]  WITH CHECK ADD  CONSTRAINT [FK_Envios_Receptor] FOREIGN KEY([ReceptorId])
REFERENCES [dbo].[Usuarios] ([UsuarioId])
GO
ALTER TABLE [dbo].[Envios] CHECK CONSTRAINT [FK_Envios_Receptor]
GO
ALTER TABLE [dbo].[Envios]  WITH CHECK ADD  CONSTRAINT [FK_Envios_Remitente] FOREIGN KEY([RemitenteId])
REFERENCES [dbo].[Usuarios] ([UsuarioId])
GO
ALTER TABLE [dbo].[Envios] CHECK CONSTRAINT [FK_Envios_Remitente]
GO
ALTER TABLE [dbo].[Envios]  WITH CHECK ADD  CONSTRAINT [FK_Envios_Repartidor] FOREIGN KEY([RepartidorId])
REFERENCES [dbo].[Usuarios] ([UsuarioId])
GO
ALTER TABLE [dbo].[Envios] CHECK CONSTRAINT [FK_Envios_Repartidor]
GO
ALTER TABLE [dbo].[HistorialEstados]  WITH CHECK ADD  CONSTRAINT [FK_Historial_Envio] FOREIGN KEY([EnvioId])
REFERENCES [dbo].[Envios] ([EnvioId])
GO
ALTER TABLE [dbo].[HistorialEstados] CHECK CONSTRAINT [FK_Historial_Envio]
GO
ALTER TABLE [dbo].[HistorialEstados]  WITH CHECK ADD  CONSTRAINT [FK_Historial_Estado] FOREIGN KEY([EstadoId])
REFERENCES [dbo].[EstadosPaquete] ([EstadoId])
GO
ALTER TABLE [dbo].[HistorialEstados] CHECK CONSTRAINT [FK_Historial_Estado]
GO
ALTER TABLE [dbo].[HistorialEstados]  WITH CHECK ADD  CONSTRAINT [FK_Historial_Usuario] FOREIGN KEY([UsuarioCambioId])
REFERENCES [dbo].[Usuarios] ([UsuarioId])
GO
ALTER TABLE [dbo].[HistorialEstados] CHECK CONSTRAINT [FK_Historial_Usuario]
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK_Usuarios_Roles] FOREIGN KEY([RolId])
REFERENCES [dbo].[Roles] ([RolId])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK_Usuarios_Roles]
GO
/****** Objeto: StoredProcedure [dbo].[sp_ActualizarEstadoEnvio] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 2. Retornar el CodigoRastreo al actualizar el estado para disparar la notificación
CREATE   PROCEDURE [dbo].[sp_ActualizarEstadoEnvio]
    @EnvioId INT,
    @NuevoEstadoId INT,
    @UsuarioCambioId INT,
    @RolUsuario NVARCHAR(50),
    @Comentario NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @EstadoActualId INT;
    DECLARE @RemitenteId INT;
    DECLARE @RepartidorId INT;
    DECLARE @CodigoRastreo NVARCHAR(30);
    DECLARE @NombreEstadoActual NVARCHAR(50);
    DECLARE @NombreNuevoEstado NVARCHAR(50);

    SELECT @EstadoActualId = EstadoActualId,
           @RemitenteId = RemitenteId,
           @RepartidorId = RepartidorId,
           @CodigoRastreo = CodigoRastreo
    FROM Envios WHERE EnvioId = @EnvioId;

    IF @EstadoActualId IS NULL
        THROW 50003, 'El envío especificado no existe.', 1;

    SELECT @NombreEstadoActual = Nombre FROM EstadosPaquete WHERE EstadoId = @EstadoActualId;
    SELECT @NombreNuevoEstado = Nombre FROM EstadosPaquete WHERE EstadoId = @NuevoEstadoId;

    IF @NombreNuevoEstado IS NULL
        THROW 50004, 'El estado destino no es válido.', 1;

    IF @NombreEstadoActual IN (N'Entregado', N'Cancelado')
        THROW 50005, 'No se puede modificar un envío que ya fue Entregado o Cancelado.', 1;

    IF @RolUsuario = N'Receptor'
        THROW 50006, 'Un receptor no tiene permisos para cambiar el estado del envío.', 1;

    IF @RolUsuario = N'Remitente'
    BEGIN
        IF @RemitenteId <> @UsuarioCambioId
            THROW 50007, 'Solo el remitente dueño del envío puede cancelarlo.', 1;
        IF @NombreNuevoEstado <> N'Cancelado' OR @NombreEstadoActual <> N'Creado'
            THROW 50008, 'El remitente solo puede cancelar envíos en estado Creado.', 1;
    END

    IF @RolUsuario = N'Repartidor'
    BEGIN
        IF @NombreNuevoEstado = N'Cancelado'
            THROW 50009, 'Un repartidor no puede cancelar un envío.', 1;

        IF @RepartidorId IS NULL
            THROW 50013, 'Debes asignar el envío a tu cuenta antes de actualizar su estado.', 1;

        IF @RepartidorId <> @UsuarioCambioId
            THROW 50010, 'Este envío está asignado a otro repartidor.', 1;
    END

    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE Envios
        SET EstadoActualId = @NuevoEstadoId
        WHERE EnvioId = @EnvioId;

        INSERT INTO HistorialEstados (EnvioId, EstadoId, UsuarioCambioId, Comentario, FechaCambio)
        VALUES (@EnvioId, @NuevoEstadoId, @UsuarioCambioId, @Comentario, GETUTCDATE());

        COMMIT TRANSACTION;
        SELECT @CodigoRastreo AS CodigoRastreo;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_AsignarEnvio] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Nuevo SP: Asignación atómica de envío a un repartidor
CREATE   PROCEDURE [dbo].[sp_AsignarEnvio]
    @EnvioId INT,
    @RepartidorId INT,
    @Comentario NVARCHAR(255) = N'Envío asignado al repartidor.'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @EstadoCreadoId INT;
    DECLARE @CodigoRastreo NVARCHAR(20);
    DECLARE @RowsAffected INT = 0;

    SELECT @EstadoCreadoId = EstadoId
    FROM EstadosPaquete
    WHERE Nombre = N'Creado';

    IF @EstadoCreadoId IS NULL
        THROW 50009, 'No se encontró el estado inicial Creado en el catálogo.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- UPDATE atómico con bloqueo exclusivo de fila para evitar condiciones de carrera
        UPDATE Envios WITH (UPDLOCK, ROWLOCK)
        SET RepartidorId = @RepartidorId
        WHERE EnvioId = @EnvioId
          AND RepartidorId IS NULL
          AND EstadoActualId = @EstadoCreadoId;

        SET @RowsAffected = @@ROWCOUNT;

        IF @RowsAffected = 0
        BEGIN
            -- Diagnosticar el motivo exacto para devolver un error de negocio claro
            IF NOT EXISTS (SELECT 1 FROM Envios WHERE EnvioId = @EnvioId)
                THROW 50001, 'El envío especificado no existe.', 1;

            IF EXISTS (SELECT 1 FROM Envios WHERE EnvioId = @EnvioId AND RepartidorId IS NOT NULL)
                THROW 50010, 'Este envío ya fue tomado por otro repartidor.', 1;

            THROW 50011, 'El envío solo puede asignarse mientras se encuentre en estado Creado.', 1;
        END

        SELECT @CodigoRastreo = CodigoRastreo
        FROM Envios
        WHERE EnvioId = @EnvioId;

        -- Registrar el movimiento de asignación en el historial manteniendo el estado actual (Creado)
        INSERT INTO HistorialEstados (EnvioId, EstadoId, UsuarioCambioId, Comentario, FechaCambio)
        VALUES (
            @EnvioId,
            @EstadoCreadoId,
            @RepartidorId,
            ISNULL(NULLIF(LTRIM(RTRIM(@Comentario)), N''), N'Envío asignado al repartidor.'),
            GETUTCDATE()
        );

        COMMIT TRANSACTION;

        SELECT @CodigoRastreo AS CodigoRastreo;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_CrearEnvio] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 2. Actualizar sp_CrearEnvio para generar el CodigoRastreo en BD y devolver ambos datos
CREATE   PROCEDURE [dbo].[sp_CrearEnvio]
    @RemitenteId INT,
    @ReceptorId INT,
    @DireccionOrigen NVARCHAR(255),
    @DireccionDestino NVARCHAR(255),
    @DescripcionPaquete NVARCHAR(255),
    @PesoKg DECIMAL(10,2),
    @DistanciaKm DECIMAL(10,2),
    @CostoTotal DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    IF @RemitenteId = @ReceptorId
        THROW 50013, 'El remitente y el receptor no pueden ser el mismo usuario.', 1;

    DECLARE @EstadoCreadoId INT;
    SELECT @EstadoCreadoId = EstadoId
    FROM EstadosPaquete
    WHERE Nombre = N'Creado';

    IF @EstadoCreadoId IS NULL
        THROW 50009, 'No se encontró el estado inicial Creado en el catálogo.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @NextSeq INT = NEXT VALUE FOR [dbo].[SeqCodigoRastreo];
        DECLARE @Anio VARCHAR(4) = CAST(YEAR(GETUTCDATE()) AS VARCHAR(4));
        -- Formatea con mínimo 4 dígitos (0001..9999) y crece naturalmente si supera 9999
        DECLARE @Correlativo VARCHAR(12) = CASE
            WHEN @NextSeq < 10000 THEN RIGHT('0000' + CAST(@NextSeq AS VARCHAR(4)), 4)
            ELSE CAST(@NextSeq AS VARCHAR(12))
        END;
        DECLARE @CodigoRastreo NVARCHAR(20) = N'LUP-' + @Anio + N'-' + @Correlativo;

        INSERT INTO Envios (
            CodigoRastreo, RemitenteId, ReceptorId, DireccionOrigen, DireccionDestino,
            DescripcionPaquete, PesoKg, DistanciaKm, CostoTotal, EstadoActualId, FechaCreacion
        )
        VALUES (
            @CodigoRastreo, @RemitenteId, @ReceptorId, @DireccionOrigen, @DireccionDestino,
            @DescripcionPaquete, @PesoKg, @DistanciaKm, @CostoTotal, @EstadoCreadoId, GETUTCDATE()
        );

        DECLARE @NuevoEnvioId INT = SCOPE_IDENTITY();

        INSERT INTO HistorialEstados (EnvioId, EstadoId, UsuarioCambioId, Comentario, FechaCambio)
        VALUES (@NuevoEnvioId, @EstadoCreadoId, @RemitenteId, N'Envío creado y cotizado.', GETUTCDATE());

        COMMIT TRANSACTION;

        SELECT @NuevoEnvioId AS EnvioId,
               @CodigoRastreo AS CodigoRastreo;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerEnvioPorCodigo] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Incluir correos del remitente y receptor al consultar un envío
CREATE   PROCEDURE [dbo].[sp_ObtenerEnvioPorCodigo]
    @CodigoRastreo NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT e.EnvioId, e.CodigoRastreo,
           e.RemitenteId, rem.NombreCompleto AS Remitente, rem.Correo AS RemitenteCorreo,
           e.RepartidorId, rep.NombreCompleto AS Repartidor,
           e.ReceptorId, rec.NombreCompleto AS Receptor, rec.Correo AS ReceptorCorreo,
           e.DireccionOrigen, e.DireccionDestino, e.DescripcionPaquete,
           e.PesoKg, e.DistanciaKm, e.CostoTotal,
           e.EstadoActualId, ep.Nombre AS EstadoActual, e.FechaCreacion
    FROM Envios e
    INNER JOIN Usuarios rem ON e.RemitenteId = rem.UsuarioId
    LEFT JOIN Usuarios rep ON e.RepartidorId = rep.UsuarioId
    INNER JOIN Usuarios rec ON e.ReceptorId = rec.UsuarioId
    INNER JOIN EstadosPaquete ep ON e.EstadoActualId = ep.EstadoId
    WHERE e.CodigoRastreo = @CodigoRastreo;

    SELECT h.HistorialId, ep.Nombre AS Estado, u.NombreCompleto AS ActualizadoPor,
           h.Comentario, h.FechaCambio
    FROM HistorialEstados h
    INNER JOIN EstadosPaquete ep ON h.EstadoId = ep.EstadoId
    INNER JOIN Usuarios u ON h.UsuarioCambioId = u.UsuarioId
    INNER JOIN Envios e ON h.EnvioId = e.EnvioId
    WHERE e.CodigoRastreo = @CodigoRastreo
    ORDER BY h.FechaCambio ASC;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerEnvioPublicoPorCodigo] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 2. Nuevo SP: Variante pública sin nombres, direcciones ni costos
CREATE   PROCEDURE [dbo].[sp_ObtenerEnvioPublicoPorCodigo]
    @CodigoRastreo NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Primer ResultSet: Solo estado actual y fecha de creación
    SELECT e.CodigoRastreo,
           e.EstadoActualId,
           ep.Nombre AS EstadoActual,
           e.FechaCreacion
    FROM Envios e
    INNER JOIN EstadosPaquete ep ON e.EstadoActualId = ep.EstadoId
    WHERE e.CodigoRastreo = @CodigoRastreo;

    -- Segundo ResultSet: Historial sin nombres de usuarios
    SELECT ep.Nombre AS Estado,
           h.Comentario,
           h.FechaCambio
    FROM HistorialEstados h
    INNER JOIN EstadosPaquete ep ON h.EstadoId = ep.EstadoId
    INNER JOIN Envios e ON h.EnvioId = e.EnvioId
    WHERE e.CodigoRastreo = @CodigoRastreo
    ORDER BY h.FechaCambio ASC;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerEnviosDisponibles] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_ObtenerEnviosDisponibles]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT e.EnvioId, e.CodigoRastreo,
           rem.NombreCompleto AS Remitente,
           rep.NombreCompleto AS Repartidor,
           rec.NombreCompleto AS Receptor,
           e.DireccionOrigen, e.DireccionDestino, e.DescripcionPaquete,
           e.PesoKg, e.DistanciaKm, e.CostoTotal,
           e.EstadoActualId, ep.Nombre AS EstadoActual, e.FechaCreacion
    FROM Envios e
    INNER JOIN Usuarios rem ON e.RemitenteId = rem.UsuarioId
    LEFT JOIN Usuarios rep ON e.RepartidorId = rep.UsuarioId
    INNER JOIN Usuarios rec ON e.ReceptorId = rec.UsuarioId
    INNER JOIN EstadosPaquete ep ON e.EstadoActualId = ep.EstadoId
    WHERE e.EstadoActualId = 1 AND e.RepartidorId IS NULL
    ORDER BY e.FechaCreacion ASC;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerEnviosPorUsuario] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_ObtenerEnviosPorUsuario]
    @UsuarioId INT,
    @Rol NVARCHAR(50),
    @EstadoId INT = NULL,
    @Busqueda NVARCHAR(100) = NULL,
    @Pagina INT = 1,
    @TamanoPagina INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    IF @Pagina < 1 SET @Pagina = 1;
    IF @TamanoPagina < 1 SET @TamanoPagina = 10;
    IF @TamanoPagina > 50 SET @TamanoPagina = 50;

    DECLARE @Offset INT = (@Pagina - 1) * @TamanoPagina;
    DECLARE @FiltroTexto NVARCHAR(102) = NULL;

    IF @Busqueda IS NOT NULL AND LTRIM(RTRIM(@Busqueda)) <> N''
        SET @FiltroTexto = N'%' + LTRIM(RTRIM(@Busqueda)) + N'%';

    -- Primer ResultSet: Total de registros que coinciden con los filtros
    SELECT COUNT(1) AS TotalRegistros
    FROM Envios e
    INNER JOIN Usuarios rem ON e.RemitenteId = rem.UsuarioId
    LEFT JOIN Usuarios rep ON e.RepartidorId = rep.UsuarioId
    INNER JOIN Usuarios rec ON e.ReceptorId = rec.UsuarioId
    WHERE
        (
            (@Rol = N'Remitente' AND e.RemitenteId = @UsuarioId)
            OR (@Rol = N'Repartidor' AND e.RepartidorId = @UsuarioId)
            OR (@Rol = N'Receptor' AND e.ReceptorId = @UsuarioId)
        )
        AND (@EstadoId IS NULL OR e.EstadoActualId = @EstadoId)
        AND (
            @FiltroTexto IS NULL
            OR e.CodigoRastreo LIKE @FiltroTexto
            OR e.DireccionOrigen LIKE @FiltroTexto
            OR e.DireccionDestino LIKE @FiltroTexto
            OR e.DescripcionPaquete LIKE @FiltroTexto
            OR rem.NombreCompleto LIKE @FiltroTexto
            OR rec.NombreCompleto LIKE @FiltroTexto
        );

    -- Segundo ResultSet: Página solicitada ordenada del más reciente al más antiguo
    SELECT e.EnvioId, e.CodigoRastreo,
           e.RemitenteId, rem.NombreCompleto AS Remitente,
           e.RepartidorId, rep.NombreCompleto AS Repartidor,
           e.ReceptorId, rec.NombreCompleto AS Receptor,
           e.DireccionOrigen, e.DireccionDestino, e.DescripcionPaquete,
           e.PesoKg, e.DistanciaKm, e.CostoTotal,
           e.EstadoActualId, ep.Nombre AS EstadoActual, e.FechaCreacion
    FROM Envios e
    INNER JOIN Usuarios rem ON e.RemitenteId = rem.UsuarioId
    LEFT JOIN Usuarios rep ON e.RepartidorId = rep.UsuarioId
    INNER JOIN Usuarios rec ON e.ReceptorId = rec.UsuarioId
    INNER JOIN EstadosPaquete ep ON e.EstadoActualId = ep.EstadoId
    WHERE
        (
            (@Rol = N'Remitente' AND e.RemitenteId = @UsuarioId)
            OR (@Rol = N'Repartidor' AND e.RepartidorId = @UsuarioId)
            OR (@Rol = N'Receptor' AND e.ReceptorId = @UsuarioId)
        )
        AND (@EstadoId IS NULL OR e.EstadoActualId = @EstadoId)
        AND (
            @FiltroTexto IS NULL
            OR e.CodigoRastreo LIKE @FiltroTexto
            OR e.DireccionOrigen LIKE @FiltroTexto
            OR e.DireccionDestino LIKE @FiltroTexto
            OR e.DescripcionPaquete LIKE @FiltroTexto
            OR rem.NombreCompleto LIKE @FiltroTexto
            OR rec.NombreCompleto LIKE @FiltroTexto
        )
    ORDER BY e.FechaCreacion DESC, e.EnvioId DESC
    OFFSET @Offset ROWS FETCH NEXT @TamanoPagina ROWS ONLY;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerEstadosPaquete] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 3. Crear SP para que el frontend pueda llenar dinámicamente el select de "Estado"
CREATE   PROCEDURE [dbo].[sp_ObtenerEstadosPaquete]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT EstadoId, Nombre, Descripcion
    FROM EstadosPaquete
    ORDER BY EstadoId ASC;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerResumenEnvios] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_ObtenerResumenEnvios]
    @UsuarioId INT,
    @Rol NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Rol NOT IN (N'Remitente', N'Repartidor', N'Receptor')
        THROW 50014, 'El rol proporcionado no es válido para generar el resumen.', 1;

    -- Primer ResultSet: Indicadores globales según el rol del usuario
    SELECT
        @Rol AS Rol,
        COUNT(e.EnvioId) AS TotalEnvios,
        ISNULL(SUM(CASE WHEN ep.Nombre NOT IN (N'Entregado', N'Cancelado') THEN 1 ELSE 0 END), 0) AS EnviosActivos,
        ISNULL(SUM(CASE WHEN ep.Nombre = N'Entregado' THEN 1 ELSE 0 END), 0) AS EnviosEntregados,
        ISNULL(SUM(CASE WHEN ep.Nombre = N'Cancelado' THEN 1 ELSE 0 END), 0) AS EnviosCancelados,
        ISNULL(SUM(CASE WHEN ep.Nombre = N'Incidencia' THEN 1 ELSE 0 END), 0) AS EnviosConIncidencia,
        ISNULL(SUM(CASE WHEN ep.Nombre <> N'Cancelado' THEN e.CostoTotal ELSE 0 END), 0.00) AS MontoTotalOperado,
        ISNULL(SUM(CASE WHEN ep.Nombre = N'Entregado' THEN e.CostoTotal ELSE 0 END), 0.00) AS MontoEntregado
    FROM Envios e
    INNER JOIN EstadosPaquete ep ON e.EstadoActualId = ep.EstadoId
    WHERE
        (@Rol = N'Remitente' AND e.RemitenteId = @UsuarioId)
        OR (@Rol = N'Repartidor' AND e.RepartidorId = @UsuarioId)
        OR (@Rol = N'Receptor' AND e.ReceptorId = @UsuarioId);

    -- Segundo ResultSet: Conteo desglosado por cada estado del catálogo
    SELECT
        ep.EstadoId,
        ep.Nombre AS Estado,
        COUNT(e.EnvioId) AS Cantidad
    FROM EstadosPaquete ep
    LEFT JOIN Envios e ON e.EstadoActualId = ep.EstadoId
        AND (
            (@Rol = N'Remitente' AND e.RemitenteId = @UsuarioId)
            OR (@Rol = N'Repartidor' AND e.RepartidorId = @UsuarioId)
            OR (@Rol = N'Receptor' AND e.ReceptorId = @UsuarioId)
        )
    GROUP BY ep.EstadoId, ep.Nombre
    ORDER BY ep.EstadoId ASC;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerTarifaPorPeso] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ==========================================
-- 2. STORED PROCEDURES DE COTIZACIÓN Y ENVÍOS
-- ==========================================
CREATE   PROCEDURE [dbo].[sp_ObtenerTarifaPorPeso]
    @PesoKg DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT TOP 1 TarifaId, NombreTarifa, PesoMinKg, PesoMaxKg, PrecioBase, PrecioPorKm
    FROM TarifasEnvio
    WHERE @PesoKg BETWEEN PesoMinKg AND PesoMaxKg;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerTarifasEnvio] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 3. Catálogo de tarifas ordenadas por peso
CREATE   PROCEDURE [dbo].[sp_ObtenerTarifasEnvio]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TarifaId, NombreTarifa, PesoMinKg, PesoMaxKg, PrecioBase, PrecioPorKm
    FROM TarifasEnvio
    ORDER BY PesoMinKg ASC;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerUsuarioPorCorreo] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ==========================================
-- 1. STORED PROCEDURES DE AUTENTICACIÓN
-- ==========================================
CREATE   PROCEDURE [dbo].[sp_ObtenerUsuarioPorCorreo]
    @Correo NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT u.UsuarioId, u.NombreCompleto, u.Correo, u.PasswordHash, 
           u.Telefono, u.RolId, r.Nombre AS RolNombre
    FROM Usuarios u
    INNER JOIN Roles r ON u.RolId = r.RolId
    WHERE u.Correo = @Correo;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_ObtenerUsuarioPorId] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Obtener usuario por ID (para GET /api/Auth/me)
CREATE   PROCEDURE [dbo].[sp_ObtenerUsuarioPorId]
    @UsuarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT u.UsuarioId, u.NombreCompleto, u.Correo, u.PasswordHash,
           u.Telefono, u.RolId, r.Nombre AS RolNombre
    FROM Usuarios u
    INNER JOIN Roles r ON u.RolId = r.RolId
    WHERE u.UsuarioId = @UsuarioId;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_RegistrarUsuario] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_RegistrarUsuario]
    @NombreCompleto NVARCHAR(150),
    @Correo NVARCHAR(150),
    @PasswordHash NVARCHAR(255),
    @Telefono NVARCHAR(20) = NULL,
    @RolId INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Usuarios (NombreCompleto, Correo, PasswordHash, Telefono, RolId)
    VALUES (@NombreCompleto, @Correo, @PasswordHash, @Telefono, @RolId);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS UsuarioId;
END;
GO
/****** Objeto: StoredProcedure [dbo].[sp_VerificarReceptorPorCorreo] Fecha de script: 26/11/2026 09:45:22 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 4. Verificar si el correo del receptor está registrado
CREATE   PROCEDURE [dbo].[sp_VerificarReceptorPorCorreo]
    @Correo NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT u.UsuarioId, u.NombreCompleto, u.Correo, r.Nombre AS Rol
    FROM Usuarios u
    INNER JOIN Roles r ON u.RolId = r.RolId
    WHERE LOWER(LTRIM(RTRIM(u.Correo))) = LOWER(LTRIM(RTRIM(@Correo)));
END;
GO
