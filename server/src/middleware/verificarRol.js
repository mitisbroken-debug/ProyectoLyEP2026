const esGerencia = (req, res, next) => {
  
  if (!req.usuario || req.usuario.role !== "gerencia") {
    return res.status(403).json({
      mensaje: "Acceso denegado: Se requieren permisos de Gerencia para eliminar clientes.",
    })
  }
  next()
}

export default esGerencia