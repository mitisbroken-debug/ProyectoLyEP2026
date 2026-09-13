import { describe, it, expect, vi, beforeEach } from "vitest"
import axios from "axios"
import clientesService from "./clientesService"

vi.mock("axios")

describe("clientesService - crearCliente", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("hace POST con los datos del cliente y devuelve la respuesta de la API", async () => {
    const clienteNuevo = { name: { firstname: "Juan" }, email: "juan@mail.com" }
    const respuestaMock = { data: { id: 21, ...clienteNuevo } }
    axios.post.mockResolvedValueOnce(respuestaMock)

    const resultado = await clientesService.crearCliente(clienteNuevo)

    expect(axios.post).toHaveBeenCalledWith(
      "https://fakestoreapi.com/users",
      clienteNuevo
    )
    expect(resultado).toEqual(respuestaMock.data)
  })

  it("propaga el error si la API rechaza la creación del cliente", async () => {
    const errorMock = new Error("Network Error")
    axios.post.mockRejectedValueOnce(errorMock)

    await expect(clientesService.crearCliente({})).rejects.toThrow("Network Error")
  })
})
