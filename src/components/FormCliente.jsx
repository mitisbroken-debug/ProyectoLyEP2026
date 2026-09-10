import '../css/formcliente.css'
import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";

const FormCliente = () => {

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");

        if (
            nombre.trim() === "" ||
            email.trim() === "" ||
            telefono.trim() === "" ||
            ciudad.trim() === "" ||
            calle.trim() === "" ||
            numero.trim() === "" ||
            codigoPostal.trim() === ""
        ) {

            setError("Complete todos los campos, incluida la dirección completa.");

            return;
        }

        const nuevoCliente = {

                email,

                username: nombre.toLowerCase().replace(/\s/g, ""),

                name: {
                    firstname: nombre,
                    lastname: "-"
                },

                address: {
                    city: ciudad,
                    street: calle,
                    number: numero,
                    zipcode: codigoPostal
                },

                phone: telefono
            };

        try {

            setLoading(true);

            const respuesta =
                await clientesService.crearCliente(
                    nuevoCliente
                );

            setMensaje(
                `Cliente creado correctamente. ID: ${respuesta.id}`
            );

            setNombre("");
            setEmail("");
            setTelefono("");
            setCiudad("");

        } catch {

            setError(
                "Ocurrió un error al crear el cliente."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className='formulario-cliente'>

            <h3>Nuevo Cliente</h3>

            <Form onSubmit={manejarSubmit}>

                <Form.Group className="mb-3">

                    <Form.Label>Nombre</Form.Label>

                    <Form.Control
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Email</Form.Label>

                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Teléfono</Form.Label>

                    <Form.Control
                        type="text"
                        value={telefono}
                        onChange={(e) =>
                            setTelefono(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Ciudad</Form.Label>

                    <Form.Control
                        type="text"
                        value={ciudad}
                        onChange={(e) =>
                            setCiudad(e.target.value)
                        }
                    />

                </Form.Group>
                <Form.Group className="mb-3">

                    <Form.Label>Calle</Form.Label>

                    <Form.Control
                        type="text"
                        value={calle}
                        onChange={(e) =>
                            setCalle(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Número</Form.Label>

                    <Form.Control
                        type="text"
                        value={numero}
                        onChange={(e) =>
                            setNumero(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Código Postal</Form.Label>

                    <Form.Control
                        type="text"
                        value={codigoPostal}
                        onChange={(e) =>
                            setCodigoPostal(e.target.value)
                        }
                    />

                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? <Spinner size="sm" />
                            : "Guardar Cliente"
                    }

                </Button>

            </Form>

            {
                mensaje &&
                <Alert
                    className="mt-3"
                    variant="success"
                >
                    {mensaje}
                </Alert>
            }

            {
                error &&
                <Alert
                    className="mt-3"
                    variant="danger"
                >
                    {error}
                </Alert>
            }

        </div>

    );
};

export default FormCliente;