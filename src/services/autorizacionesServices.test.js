import { describe, it, expect, vi, beforeEach } from "vitest"
import axios from "axios"
import AutorizacionesService from "./autorizacionesServices"

vi.mock("axios")

describe("autorizacionesServices - login", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("hace POST a /auth/login con el email, password y sector recibidos", async () => {
    const respuestaMock = {
      data: {
        token: "token-de-prueba",
        usuario: { nombre: "Antonella", email: "antonella@gmail.com", sector: "Soporte" },
      },
    }
    axios.post.mockResolvedValueOnce(respuestaMock)

    const resultado = await AutorizacionesService.login(
      "antonella@gmail.com",
      "Admin123",
      "Soporte"
    )

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      { email: "antonella@gmail.com", password: "Admin123", sector: "Soporte" }
    )
    expect(resultado).toEqual(respuestaMock.data)
  })

  it("propaga el error cuando el backend responde con credenciales inválidas", async () => {
    const errorMock = { response: { status: 401, data: { mensaje: "Credenciales inválidas" } } }
    axios.post.mockRejectedValueOnce(errorMock)

    await expect(
      AutorizacionesService.login("mail@mail.com", "malaPassword", "Soporte")
    ).rejects.toEqual(errorMock)
  })
})
