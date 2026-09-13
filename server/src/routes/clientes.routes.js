import express from "express"
import verificarToken from "../middleware/verificarToken.js"
import esGerencia from "../middleware/verificarRol.js"

const router = express.Router()


router.delete("/:id", verificarToken, esGerencia, (req, res) => {
  res.json({ mensaje: `Cliente con ID ${req.params.id} eliminado correctamente` })
})

export default router