// Middleware listo para usarse en futuras rutas protegidas del backend
// (por ejemplo, la baja de un cliente: ver hallazgo de control de acceso
// en ANALISIS.md). No se usa todavía en esta PR porque el único endpoint
// existente es /api/auth/login, que es público por definición.

import jwt from "jsonwebtoken"

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no provisto" })
  }

  const token = authHeader.split(" ")[1]

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ mensaje: "Token inválido o expirado" })
  }
}

export default verificarToken
