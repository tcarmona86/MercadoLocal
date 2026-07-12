import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  Spinner
} from "react-bootstrap";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import PasswordInput from "../components/PasswordInput.jsx";
import useAuth from "../hooks/useAuth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (evento) => {
    evento.preventDefault();
    setMensaje("");

    if (!email.trim() || !password) {
      setMensaje("Ingresa correo y contraseña.");
      return;
    }

    setCargando(true);

    const resultado = await iniciarSesion(
      email.trim(),
      password
    );

    setCargando(false);

    if (resultado.ok) {
      navigate(location.state?.from || "/");
      return;
    }

    setMensaje(resultado.mensaje);
  };

  return (
    <Container className="auth-page">
      <section className="auth-card">
        <h1>Iniciar sesión</h1>

        {location.state?.mensaje && (
          <Alert variant="warning">
            {location.state.mensaje}
          </Alert>
        )}

        {mensaje && (
          <Alert variant="danger">
            {mensaje}
          </Alert>
        )}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="correo@ejemplo.cl"
              autoComplete="email"
              required
            />
          </Form.Group>

          <PasswordInput
            label="Contraseña"
            name="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
            className="mb-4"
          />

          <Button
            type="submit"
            className="primary-action w-100"
            disabled={cargando}
          >
            {cargando ? <Spinner size="sm" /> : "Ingresar"}
          </Button>
        </Form>

        <p className="mt-3 mb-0">
          ¿No tienes cuenta?{" "}
          <Link to="/registro">
            Crear cuenta
          </Link>
        </p>
      </section>
    </Container>
  );
}
