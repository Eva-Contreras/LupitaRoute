import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

test('el resumen envia el token y valida la respuesta y los errores', async () => {
  const fetchOriginal = globalThis.fetch
  const urlOriginal = process.env.VITE_API_URL
  process.env.VITE_API_URL = 'https://example.invalid'
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

  try {
    const { obtenerResumen, ErrorApi } = await server.ssrLoadModule('/src/services/envios.ts')
    const datos = {
      rol: 'Repartidor',
      totalEnvios: 4,
      enviosActivos: 2,
      enviosEntregados: 1,
      enviosCancelados: 0,
      enviosConIncidencia: 1,
      montoTotalOperado: 125.5,
      montoEntregado: 80,
      desglosePorEstado: [{ estadoId: 4, estado: 'En reparto', cantidad: 2 }],
    }

    globalThis.fetch = async (url, opciones) => {
      assert.equal(url, 'https://example.invalid/api/Envios/resumen')
      assert.equal(opciones.headers.Authorization, 'Bearer token-prueba')
      return new Response(JSON.stringify(datos), { status: 200 })
    }
    assert.deepEqual(await obtenerResumen('token-prueba'), datos)

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ ...datos, totalEnvios: null }), { status: 200 })
    await assert.rejects(obtenerResumen('token-prueba'), /resumen no/)

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ ...datos, desglosePorEstado: [{}] }), { status: 200 })
    await assert.rejects(obtenerResumen('token-prueba'), /resumen no/)

    globalThis.fetch = async () => new Response('', { status: 401 })
    await assert.rejects(
      obtenerResumen('token-prueba'),
      (error) => error instanceof ErrorApi && error.estado === 401,
    )

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ mensaje: 'Error de resumen' }), { status: 400 })
    await assert.rejects(obtenerResumen('token-prueba'), /Error de resumen/)
  } finally {
    globalThis.fetch = fetchOriginal
    if (urlOriginal === undefined) delete process.env.VITE_API_URL
    else process.env.VITE_API_URL = urlOriginal
    await server.close()
  }
})
