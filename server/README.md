# Backend de autenticación — Panel de Control de Clientes

API mínima en Node.js + Express que reemplaza el padrón de usuarios que
antes vivía hardcodeado y en texto plano en el frontend
(`src/services/autorizacionesServices.js`). Ver `ANALISIS.md` en la raíz
del proyecto para el detalle del hallazgo de seguridad que motivó este
cambio.

## Qué resuelve

- Las contraseñas de los usuarios ya no viajan en el bundle de JavaScript
  del cliente: viven únicamente en este servidor, y hasheadas con bcrypt.
- El login se valida en el servidor, no en el navegador.
- Se emite un JWT al autenticarse correctamente, que el frontend guarda
  para futuras peticiones autenticadas (por ejemplo, la baja de un
  cliente, que hoy solo se protege del lado del cliente).

## Instalación

```bash
cd server
npm install
cp .env.example .env
# editar .env y poner un JWT_SECRET propio
npm run seed      # genera src/data/usuarios.js con los hashes reales
npm run dev        # o "npm start"
```

El servidor queda escuchando en `http://localhost:4000` (configurable con
`PORT` en `.env`).

## Endpoints

### `POST /api/auth/login`

**Body:**
```json
{
  "email": "antonella@gmail.com",
  "password": "Admin123",
  "sector": "Soporte"
}
```

**Respuesta OK (200):**
```json
{
  "token": "eyJhbGciOi...",
  "usuario": {
    "nombre": "Antonella",
    "email": "antonella@gmail.com",
    "sector": "Soporte"
  }
}
```

**Respuesta error (401):**
```json
{ "mensaje": "Credenciales inválidas" }
```

### `GET /api/health`

Chequeo simple de que el servidor está levantado.

## Conectar el frontend

En la raíz del proyecto (no en `server/`), crear un `.env` con:

```
VITE_API_URL=http://localhost:4000/api
```

y correr el frontend (`npm run dev`) en paralelo al backend.
