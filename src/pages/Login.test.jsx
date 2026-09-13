import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Login from "./Login"
import { AutorizacionesContext } from "../context/AutorizacionesContext"
import AutorizacionesService from "../services/autorizacionesServices"

// Nota: usamos consultas por tipo de input (no getByLabelText) porque los
// <label> del formulario todavía no están asociados a sus <input> con
// htmlFor/id (ver hallazgo de accesibilidad en ANALISIS.md). Cuando esa
// mejora se implemente, estas consultas se pueden simplificar.

vi.mock("../services/autorizacionesServices")

const renderLogin = (setAdmin = vi.fn()) => {
  const utils = render(
    <AutorizacionesContext.Provider value={{ admin: null, setAdmin }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AutorizacionesContext.Provider>
  )

  const emailInput = screen.getByRole("textbox")
  const passwordInput = utils.container.querySelector('input[type="password"]')
  const sectorSelect = screen.getByRole("combobox")
  const botonIngresar = screen.getByRole("button", { name: /ingresar/i })

  return { ...utils, emailInput, passwordInput, sectorSelect, botonIngresar }
}

describe("Login", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    window.alert = vi.fn()
  })

  it("muestra errores de validación si se envía el formulario vacío", async () => {
    const user = userEvent.setup()
    const { botonIngresar } = renderLogin()

    await user.click(botonIngresar)

    expect(screen.getByText("El email es obligatorio")).toBeInTheDocument()
    expect(screen.getByText("La contraseña es obligatoria")).toBeInTheDocument()
    expect(screen.getByText("Seleccione un sector")).toBeInTheDocument()
    expect(AutorizacionesService.login).not.toHaveBeenCalled()
  })

  it("marca la contraseña como inválida si no cumple el formato requerido", async () => {
    const user = userEvent.setup()
    const { emailInput, passwordInput, botonIngresar } = renderLogin()

    await user.type(emailInput, "test@mail.com")
    await user.type(passwordInput, "abc")
    await user.click(botonIngresar)

    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument()
  })

  it("llama al servicio de login y guarda la sesión cuando los datos son válidos", async () => {
    const setAdmin = vi.fn()
    const usuarioMock = { nombre: "Antonella", email: "antonella@gmail.com", sector: "Soporte" }
    AutorizacionesService.login.mockResolvedValueOnce({
      token: "token-de-prueba",
      usuario: usuarioMock,
    })

    const user = userEvent.setup()
    const { emailInput, passwordInput, sectorSelect, botonIngresar } = renderLogin(setAdmin)

    await user.type(emailInput, "antonella@gmail.com")
    await user.type(passwordInput, "Admin123")
    await user.selectOptions(sectorSelect, "Soporte")
    await user.click(botonIngresar)

    await waitFor(() => expect(setAdmin).toHaveBeenCalledWith(usuarioMock))
    expect(localStorage.getItem("token")).toBe("token-de-prueba")
    expect(localStorage.getItem("role")).toBe("Soporte")
  })

  it("muestra una alerta cuando el backend responde con credenciales inválidas", async () => {
    AutorizacionesService.login.mockRejectedValueOnce({ response: { status: 401 } })

    const user = userEvent.setup()
    const { emailInput, passwordInput, sectorSelect, botonIngresar } = renderLogin()

    await user.type(emailInput, "antonella@gmail.com")
    await user.type(passwordInput, "Admin123")
    await user.selectOptions(sectorSelect, "Soporte")
    await user.click(botonIngresar)

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Verifique los datos")
    )
  })

  it("muestra una alerta distinta cuando falla la conexión con el servidor", async () => {
    AutorizacionesService.login.mockRejectedValueOnce(new Error("Network Error"))

    const user = userEvent.setup()
    const { emailInput, passwordInput, sectorSelect, botonIngresar } = renderLogin()

    await user.type(emailInput, "antonella@gmail.com")
    await user.type(passwordInput, "Admin123")
    await user.selectOptions(sectorSelect, "Soporte")
    await user.click(botonIngresar)

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "No se pudo conectar con el servidor. Intente nuevamente."
      )
    )
  })
})
