// Genera `src/data/usuarios.js` (el archivo que SÍ importa la app) a partir
// del seed en texto plano `src/data/usuarios.seed.js`, hasheando cada
// contraseña con bcrypt. Se corre una sola vez (o cada vez que cambie el
// padrón de usuarios):
//
//   npm run seed
//
// Después de correrlo, revisá que `usuarios.js` haya quedado con los hashes
// y NUNCA subas `usuarios.seed.js` a un repositorio compartido.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import bcrypt from "bcryptjs"
import usuariosSeed from "../data/usuarios.seed.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SALT_ROUNDS = 10

const generar = async () => {
  const usuariosHasheados = await Promise.all(
    usuariosSeed.map(async (usuario) => ({
      nombre: usuario.nombre,
      email: usuario.email,
      sector: usuario.sector,
      passwordHash: await bcrypt.hash(usuario.password, SALT_ROUNDS),
    }))
  )

  const contenido = `// Archivo generado automáticamente por \`npm run seed\`
// (ver src/scripts/generarUsuarios.js). NO contiene contraseñas en texto
// plano, solo hashes de bcrypt. Este es el único archivo de usuarios que
// importa el controlador de autenticación.

const usuarios = ${JSON.stringify(usuariosHasheados, null, 2)}

export default usuarios
`

  const destino = path.join(__dirname, "..", "data", "usuarios.js")
  fs.writeFileSync(destino, contenido, "utf-8")
  console.log(`✅ ${usuariosHasheados.length} usuarios generados en ${destino}`)
}

generar().catch((error) => {
  console.error("❌ Error generando usuarios.js:", error)
  process.exit(1)
})
