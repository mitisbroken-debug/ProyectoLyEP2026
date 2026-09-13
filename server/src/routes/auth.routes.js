import { Router } from "express"
import { login } from "../controllers/auth.controller.js"
import esGerencia from "../middleware/verificarRol.js"
import verificarToken from "../middleware/verificarToken.js"

const router = Router()

router.post("/login", login)
router.delete("/clientes/:id", verificarToken, esGerencia, (req, res) => {
  res.json({ mensaje: `Cliente con ID ${req.params.id} eliminado correctamente` })
})

export default router
