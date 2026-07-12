import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import PasswordInput from "../components/PasswordInput.jsx";
import useAuth from "../hooks/useAuth.js";

const initial = {
  nombre: "",
  apellido: "",
  rut: "",
  email: "",
  telefono: "",
  direccion: "",
  comuna: "",
  region: "",
  password: "",
  confirmar: ""
};

const PASSWORD_SEGURA =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const AYUDA_PASSWORD =
  "Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";

export default function Registro() {
  const [form, setForm] = useState(initial);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const { registrarUsuario } = useAuth();
  const navigate = useNavigate();

  const change = (evento) => {
    setForm({
      ...form,
      [evento.target.name]: evento.target.value
    });
  };

  const submit = async (evento) => {
    evento.preventDefault();
    setMensaje("");

    if (form.nombre.trim().length < 2) {
      setMensaje(
        "El nombre debe tener al menos 2 caracteres."
      );
      return;
    }

    if (!PASSWORD_SEGURA.test(form.password)) {
      setMensaje(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }

    if (form.password !== form.confirmar) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    const resultado = await registrarUsuario({
      ...form,
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      confirmar: undefined
    });

    setCargando(false);

    if (resultado.ok) {
      navigate("/");
      return;
    }

    setMensaje(resultado.mensaje);
  };

  const campos = [
    ["nombre", "Nombre", "text"],
    ["apellido", "Apellido", "text"],
    ["rut", "RUT", "text"],
    ["email", "Correo", "email"],
    ["telefono", "Teléfono", "text"],
    ["direccion", "Dirección", "text"],
    ["comuna", "Comuna", "text"],
    ["region", "Región", "text"]
  ];

  return (
    <Container className="auth-page">
      <section className="auth-card auth-card-wide">
        <h1>Crear cuenta</h1>

        {mensaje && (
          <Alert variant="danger">
            {mensaje}
          </Alert>
        )}

        <Form onSubmit={submit}>
          <Row>
            {campos.map(([name, label, type]) => (
              <Col md={6} key={name}>
                <Form.Group className="mb-3">
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={change}
                    required={["nombre", "email"].includes(name)}
                  />
                </Form.Group>
              </Col>
            ))}

            <Col md={6}>
              <PasswordInput
                label="Contraseña"
                name="password"
                value={form.password}
                onChange={change}
                autoComplete="new-password"
                required
                className="mb-3"
                helpText={AYUDA_PASSWORD}
              />
            </Col>

            <Col md={6}>
              <PasswordInput
                label="Confirmar contraseña"
                name="confirmar"
                value={form.confirmar}
                onChange={change}
                autoComplete="new-password"
                required
                className="mb-3"
              />
            </Col>
          </Row>

          <Button
            type="submit"
            className="primary-action w-100"
            disabled={cargando}
          >
            {cargando ? <Spinner size="sm" /> : "Crear cuenta"}
          </Button>
        </Form>
      </section>
    </Container>
  );
}
