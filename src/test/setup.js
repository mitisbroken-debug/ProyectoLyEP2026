// Se carga automáticamente antes de cada archivo de test (ver vite.config.js).
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

afterEach(() => {
  cleanup()
  localStorage.clear()
})
