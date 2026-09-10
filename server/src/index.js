import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.use("/api/auth", authRoutes)

app.use((_req, res) => {
  res.status(404).json({ mensaje: "Recurso no encontrado" })
})

app.listen(PORT, () => {
  console.log(`🔐 Servidor de autenticación escuchando en http://localhost:${PORT}`)
})
