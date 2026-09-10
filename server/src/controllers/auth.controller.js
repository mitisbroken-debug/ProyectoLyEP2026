import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import usuarios from "../data/usuarios.js"

export const login = async (req, res) => {
  const { email, password, sector } = req.body

  if (!email || !password || !sector) {
    return res.status(400).json({ mensaje: "Email, contraseña y sector son obligatorios" })
  }

  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.sector === sector
  )

  // Mismo mensaje tanto si el usuario no existe como si la contraseña es
  // incorrecta, para no filtrar qué emails están registrados.
  if (!usuario) {
    return res.status(401).json({ mensaje: "Credenciales inválidas" })
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash)

  if (!passwordValida) {
    return res.status(401).json({ mensaje: "Credenciales inválidas" })
  }

  const token = jwt.sign(
    { email: usuario.email, sector: usuario.sector, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  )

  return res.status(200).json({
    token,
    usuario: {
      nombre: usuario.nombre,
      email: usuario.email,
      sector: usuario.sector,
    },
  })
}
