import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

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
      return new Response(JSON.stringify({
        envioId: 17,
        codigoRastreo: 'LUP-2026-0017',
      }), { status: 200 })
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
