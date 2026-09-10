import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

const login = async (email, password, sector) => {
  const respuesta = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
    sector,
  })

  // { token, usuario: { nombre, email, sector } }
  return respuesta.data
}

export default {
  login,
}
