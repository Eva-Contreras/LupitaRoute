# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Configuración de la API local

La URL de la API se configura en `VITE_API_URL`. El archivo `.env.local` usa por
defecto la URL HTTPS local del backend (`https://localhost:7234`); edítala si la
API está disponible en otra dirección. Para preparar otra máquina, copia
`.env.example` como `.env.local`. No incluyas credenciales ni secretos en estos
archivos.

El inicio de sesión envía `correo` y `password` a `POST /api/Auth/login`. La
sesión se mantiene solo en memoria y se limpia al cerrar sesión.

Desde el inicio de sesión se puede crear una cuenta de receptor. El frontend
envía nombre, correo, contraseña, teléfono opcional y `rolId: 3` a
`POST /api/Auth/register`; después se puede iniciar sesión. El frontend no puede
garantizar que el registro público se limite a receptores: esa restricción debe
validarse también en el backend.

En “Mis envíos”, el código de cada envío abre su detalle. El historial se
consulta mediante `GET /api/Envios/rastreo/{codigo}`, un endpoint público del
backend actual. Se puede volver a la lista conservando los filtros y copiar
el código de rastreo.

El repartidor puede consultar el detalle y el historial de sus entregas, acceder
desde ahí a la actualización de estado y recargar la lista. La sección “Envíos
disponibles” consulta `GET /api/Envios/disponibles` y permite confirmar la
recolección. El frontend obtiene el identificador de Recolectado del catálogo,
actualiza el estado y vuelve a consultar “Mis entregas”. La asignación la realiza
el procedimiento del backend; el frontend no puede evitar asignaciones
simultáneas.

El receptor consulta “Mis paquetes” con `GET /api/Envios/mis-envios`, filtra
sus envíos y abre el detalle y el historial de cada uno. También puede rastrear
por código usando el endpoint público, incluso si el envío no está asociado a
su cuenta. Solo aparecen en su lista los envíos registrados para su usuario.

Los componentes reutilizados por varios roles están en la raíz de
`src/components`; las carpetas `remitente`, `repartidor` y `receptor` contienen
las vistas específicas de cada rol. La tabla y los filtros compartidos
conservan las columnas y acciones correspondientes a cada vista.

## Comandos

- `npm run dev`: inicia el servidor local de Vite.
- `npm run build`: verifica los tipos y genera la compilación.
- `npm run lint`: ejecuta ESLint.

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
