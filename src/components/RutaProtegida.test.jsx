import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { AutorizacionesContext } from "../context/AutorizacionesContext"
import RutaProtegida from "./RutaProtegida"

const renderConContexto = (adminValue) => {
  return render(
    <AutorizacionesContext.Provider value={{ admin: adminValue }}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <RutaProtegida>
                <div>Contenido protegido</div>
              </RutaProtegida>
            }
          />
          <Route path="/login" element={<div>Pantalla de login</div>} />
        </Routes>
      </MemoryRouter>
    </AutorizacionesContext.Provider>
  )
}

describe("RutaProtegida", () => {
  it("redirige a /login cuando no hay un admin autenticado", () => {
    renderConContexto(null)

    expect(screen.getByText("Pantalla de login")).toBeInTheDocument()
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument()
  })

  it("renderiza el contenido protegido cuando hay un admin autenticado", () => {
    renderConContexto({
      nombre: "Antonella",
      email: "antonella@gmail.com",
      sector: "Soporte",
    })

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument()
    expect(screen.queryByText("Pantalla de login")).not.toBeInTheDocument()
  })
})
