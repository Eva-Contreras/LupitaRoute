import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

const envioCompleto = {
  envioId: 17,
  codigoRastreo: 'LUP-2026-0017',
  remitente: 'Ana',
  receptor: 'Luis',
  direccionOrigen: 'Origen 1',
  direccionDestino: 'Destino 2',
  descripcionPaquete: 'Caja',
  pesoKg: 2,
  distanciaKm: 10,
  costoTotal: 50,
  estadoActualId: 1,
  estadoActual: 'Creado',
  fechaCreacion: '2026-01-01T10:00:00',
}

test('asigna el envío antes de registrar la recolección', async () => {
  const fetchOriginal = globalThis.fetch
  const urlOriginal = process.env.VITE_API_URL
  process.env.VITE_API_URL = 'https://example.invalid'
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

  try {
    const { asignarYRegistrarRecoleccion } =
      await server.ssrLoadModule('/src/services/envios.ts')
    const solicitudes = []
    globalThis.fetch = async (url, opciones) => {
      solicitudes.push({ url, opciones })
      if (solicitudes.length === 1) {
        return new Response(JSON.stringify(envioCompleto), { status: 200 })
      }
      return new Response(JSON.stringify({ mensaje: 'Estado actualizado correctamente.' }), {
        status: 200,
      })
    }

    await asignarYRegistrarRecoleccion('token-prueba', 17, 2)

    assert.equal(solicitudes.length, 2)
    assert.equal(solicitudes[0].url, 'https://example.invalid/api/Envios/17/asignar')
    assert.equal(solicitudes[0].opciones.method, 'PUT')
    assert.equal(solicitudes[0].opciones.headers.Authorization, 'Bearer token-prueba')
    assert.equal(solicitudes[0].opciones.body, undefined)
    assert.equal(solicitudes[1].url, 'https://example.invalid/api/Envios/17/estado')
    assert.equal(solicitudes[1].opciones.method, 'PUT')
    assert.equal(solicitudes[1].opciones.headers.Authorization, 'Bearer token-prueba')
    assert.deepEqual(JSON.parse(solicitudes[1].opciones.body), {
      nuevoEstadoId: 2,
      comentario: null,
    })
  } finally {
    globalThis.fetch = fetchOriginal
    if (urlOriginal === undefined) delete process.env.VITE_API_URL
    else process.env.VITE_API_URL = urlOriginal
    await server.close()
  }
})

test('no intenta registrar la recolección si la asignación falla', async () => {
  const fetchOriginal = globalThis.fetch
  const urlOriginal = process.env.VITE_API_URL
  process.env.VITE_API_URL = 'https://example.invalid'
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

  try {
    const { asignarYRegistrarRecoleccion } =
      await server.ssrLoadModule('/src/services/envios.ts')
    let solicitudes = 0
    globalThis.fetch = async () => {
      solicitudes += 1
      return new Response(JSON.stringify({ mensaje: 'Este envío ya fue tomado.' }), {
        status: 400,
      })
    }

    await assert.rejects(
      asignarYRegistrarRecoleccion('token-prueba', 17, 2),
      /Este envío ya fue tomado/,
    )
    assert.equal(solicitudes, 1)
  } finally {
    globalThis.fetch = fetchOriginal
    if (urlOriginal === undefined) delete process.env.VITE_API_URL
    else process.env.VITE_API_URL = urlOriginal
    await server.close()
  }
})

test('consume tarifas, verifica receptores y asigna envíos con los contratos del backend', async () => {
  const fetchOriginal = globalThis.fetch
  const urlOriginal = process.env.VITE_API_URL
  process.env.VITE_API_URL = 'https://example.invalid'
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

  try {
    const { asignarEnvio, obtenerTarifas, verificarReceptor } =
      await server.ssrLoadModule('/src/services/envios.ts')

    let solicitud
    globalThis.fetch = async (url, opciones) => {
      solicitud = { url, opciones }
      return new Response(JSON.stringify([{
        tarifaId: 2,
        nombreTarifa: 'Estándar',
        pesoMinKg: 0.01,
        pesoMaxKg: 10,
        precioBase: 25,
        precioPorKm: 3,
      }]), { status: 200 })
    }
    assert.deepEqual(await obtenerTarifas(), [{
      tarifaId: 2,
      nombreTarifa: 'Estándar',
      pesoMinKg: 0.01,
      pesoMaxKg: 10,
      precioBase: 25,
      precioPorKm: 3,
    }])
    assert.equal(solicitud.url, 'https://example.invalid/api/Envios/tarifas')
    assert.equal(solicitud.opciones.method, 'GET')

    globalThis.fetch = async (url, opciones) => {
      solicitud = { url, opciones }
      return new Response(JSON.stringify({
        usuarioId: 8,
        nombreCompleto: 'Ana Receptora',
        correo: 'ana@example.com',
        rol: 'Receptor',
      }), { status: 200 })
    }
    assert.deepEqual(await verificarReceptor('token-prueba', 'ana@example.com'), {
      usuarioId: 8,
      nombreCompleto: 'Ana Receptora',
      correo: 'ana@example.com',
      rol: 'Receptor',
    })
    assert.equal(solicitud.url, 'https://example.invalid/api/Envios/verificar-receptor?correo=ana%40example.com')
    assert.equal(solicitud.opciones.headers.Authorization, 'Bearer token-prueba')

    globalThis.fetch = async (url, opciones) => {
      solicitud = { url, opciones }
      return new Response(JSON.stringify(envioCompleto), { status: 200 })
    }
    assert.equal((await asignarEnvio('token-prueba', 17)).envioId, 17)
    assert.equal(solicitud.url, 'https://example.invalid/api/Envios/17/asignar')
    assert.equal(solicitud.opciones.method, 'PUT')
    assert.equal(solicitud.opciones.headers.Authorization, 'Bearer token-prueba')
    assert.equal(solicitud.opciones.body, undefined)
  } finally {
    globalThis.fetch = fetchOriginal
    if (urlOriginal === undefined) delete process.env.VITE_API_URL
    else process.env.VITE_API_URL = urlOriginal
    await server.close()
  }
})

test('carga el perfil vigente del backend al iniciar sesión', async () => {
  const fetchOriginal = globalThis.fetch
  const urlOriginal = process.env.VITE_API_URL
  process.env.VITE_API_URL = 'https://example.invalid'
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

  try {
    const { login } = await server.ssrLoadModule('/src/services/auth.ts')
    let inicioSesion = true
    globalThis.fetch = async (url, opciones) => {
      if (inicioSesion) {
        inicioSesion = false
        assert.equal(url, 'https://example.invalid/api/Auth/login')
        assert.equal(opciones.method, 'POST')
        return new Response(JSON.stringify({
          token: 'token-prueba',
          usuario: {
            usuarioId: 4,
            nombreCompleto: 'Nombre del login',
            correo: 'ana@example.com',
            rolId: 1,
            rol: 'Remitente',
          },
        }), { status: 200 })
      }

      assert.equal(url, 'https://example.invalid/api/Auth/me')
      assert.equal(opciones.headers.Authorization, 'Bearer token-prueba')
      return new Response(JSON.stringify({
        usuarioId: 4,
        nombreCompleto: 'Nombre vigente',
        correo: 'ana@example.com',
        rolId: 1,
        rol: 'Remitente',
      }), { status: 200 })
    }

    const sesion = await login('ana@example.com', 'password')
    assert.equal(sesion.usuario.nombreCompleto, 'Nombre vigente')
  } finally {
    globalThis.fetch = fetchOriginal
    if (urlOriginal === undefined) delete process.env.VITE_API_URL
    else process.env.VITE_API_URL = urlOriginal
    await server.close()
  }
})

test('registra cada tipo de usuario con su rol y comunica errores del backend', async () => {
  const fetchOriginal = globalThis.fetch
  const urlOriginal = process.env.VITE_API_URL
  process.env.VITE_API_URL = 'https://example.invalid'
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

  try {
    const { registrarUsuario } = await server.ssrLoadModule('/src/services/auth.ts')
    const datos = { nombreCompleto: 'Ana', correo: 'ana@example.com', password: '123456' }

    for (const [rol, rolId] of [['Remitente', 1], ['Repartidor', 2], ['Receptor', 3]]) {
      globalThis.fetch = async (url, opciones) => {
        assert.equal(url, 'https://example.invalid/api/Auth/register')
        assert.equal(opciones.method, 'POST')
        assert.deepEqual(JSON.parse(opciones.body), { ...datos, rolId })
        return new Response('{}', { status: 200 })
      }
      await registrarUsuario(datos, rol)
    }

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ mensaje: 'El correo ya está registrado.' }), { status: 400 })
    await assert.rejects(registrarUsuario(datos, 'Remitente'), /El correo ya está registrado/)
  } finally {
    globalThis.fetch = fetchOriginal
    if (urlOriginal === undefined) delete process.env.VITE_API_URL
    else process.env.VITE_API_URL = urlOriginal
    await server.close()
  }
})

test('rechaza respuestas que rompen el contrato indicando el campo', async () => {
  const fetchOriginal = globalThis.fetch
  const urlOriginal = process.env.VITE_API_URL
  process.env.VITE_API_URL = 'https://example.invalid'
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

  try {
    const { obtenerEnviosDisponibles } = await server.ssrLoadModule('/src/services/envios.ts')
    const { costoTotal, ...incompleto } = envioCompleto
    globalThis.fetch = async () => new Response(JSON.stringify([envioCompleto, incompleto]), { status: 200 })

    await assert.rejects(
      () => obtenerEnviosDisponibles('token-prueba'),
      (error) => error.name === 'ErrorApi' && error.message.includes('costoTotal'),
    )
  } finally {
    globalThis.fetch = fetchOriginal
    if (urlOriginal === undefined) delete process.env.VITE_API_URL
    else process.env.VITE_API_URL = urlOriginal
    await server.close()
  }
})

test('el repartidor no puede elegir el estado Cancelado', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })

  try {
    const React = await import('react')
    const { renderToString } = await import('react-dom/server')
    const { ActualizarEstado } = await server.ssrLoadModule('/src/components/repartidor/ActualizarEstado.tsx')
    const html = renderToString(React.createElement(ActualizarEstado, {
      entregas: [envioCompleto],
      estados: [
        { estadoId: 2, nombre: 'Recolectado', descripcion: '' },
        { estadoId: 5, nombre: 'Cancelado', descripcion: '' },
      ],
      envioIdInicial: 17,
      onGuardar: async () => {},
    }))

    assert.match(html, /Recolectado/)
    assert.doesNotMatch(html, /Cancelado/)
  } finally {
    await server.close()
  }
})