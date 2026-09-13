import '../css/detallecliente.css'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    
    fetch(`https://fakestoreapi.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => setCliente(data))
      .catch(() => setMensaje("Error al cargar los datos del cliente"));
  }, [id]);

  const eliminarCliente = async () => {
    
    const token = localStorage.getItem("token");

    try {
      
      const respuesta = await fetch(`http://localhost:3000/api/clientes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(data.mensaje || "Cliente eliminado correctamente");
        setTimeout(() => {
          navigate("/clientes");
        }, 2000);
      } else if (respuesta.status === 403) {
        // Rechazado por esGerencia
        setMensaje("Acceso denegado: Se requieren permisos de Gerencia.");
      } else if (respuesta.status === 401) {
        // Rechazado por verificarToken
        setMensaje("Sesión expirada o no autorizada. Iniciá sesión nuevamente.");
      } else {
        setMensaje(data.mensaje || "Error al eliminar el cliente.");
      }
    } catch (error) {
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  if (!cliente) {
    return <h2 className="detalle-cliente-cargando">Cargando datos del cliente...</h2>;
  }

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>
      <p>Rol actual: {role}</p>

      {mensaje && <p className='mensaje-eliminado'>{mensaje}</p>}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      <p>
        <strong>Nombre:</strong>{" "}
        {cliente.name.firstname} {cliente.name.lastname}
      </p>

      <p>
        <strong>Email:</strong> {cliente.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {cliente.phone}
      </p>

      <h2>Dirección</h2>

      <p>
        <strong>Calle:</strong> {cliente.address.street}
      </p>

      <p>
        <strong>Número:</strong> {cliente.address.number}
      </p>

      <p>
        <strong>Código Postal:</strong> {cliente.address.zipcode}
      </p>

      <p>
        <strong>Ciudad:</strong> {cliente.address.city}
      </p>

      
      <h2>Datos de acceso</h2>

      <p>
        <strong>Usuario:</strong> {cliente.username}
      </p>

      {role?.trim() === "Gerencia" && (
        <button className='btn-eliminar' onClick={eliminarCliente}>
          Eliminar Cliente
        </button>
      )}
    </div>
  );
};

export default DetalleCliente;