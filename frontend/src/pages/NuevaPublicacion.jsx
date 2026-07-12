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

import PerfilMenu from "../components/PerfilMenu.jsx";
import PublicacionPreview from "../components/PublicacionPreview.jsx";
import useAuth from "../hooks/useAuth.js";
import useProducts from "../hooks/useProducts.js";
import {
  formatearCLP,
  limpiarPrecioCLP
} from "../utils/formatters.js";

const initial = {
  nombre: "",
  descripcion: "",
  categoria: "",
  precio: "",
  stock: "1",
  estado: "Nuevo",
  imagen: "",
  envio: "Envío a todo Chile"
};

const esUrlPublica = (valor) => {
  try {
    const url = new URL(valor);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export default function NuevaPublicacion() {
  const { categorias, agregarProductoPublicado } = useProducts();
  const { usuario } = useAuth();

  const [form, setForm] = useState(initial);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const change = (evento) => {
    setForm({
      ...form,
      [evento.target.name]: evento.target.value
    });
  };

  const cambiarPrecio = (evento) => {
    setForm({
      ...form,
      precio: limpiarPrecioCLP(evento.target.value)
    });
  };

  const submit = async (evento) => {
    evento.preventDefault();
    setMensaje("");

    if (form.nombre.trim().length < 3) {
      setMensaje(
        "El título debe tener al menos 3 caracteres."
      );
      return;
    }

    if (form.descripcion.trim().length < 10) {
      setMensaje(
        "La descripción debe tener al menos 10 caracteres."
      );
      return;
    }

    if (!form.categoria) {
      setMensaje("Selecciona una categoría.");
      return;
    }

    if (!["Nuevo", "Usado"].includes(form.estado)) {
      setMensaje("Selecciona si el producto es nuevo o usado.");
      return;
    }

    if (Number(form.precio) <= 0) {
      setMensaje("Ingresa un precio válido en pesos chilenos.");
      return;
    }

    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 1) {
      setMensaje("El stock debe ser un número entero mayor a cero.");
      return;
    }

    if (!form.envio) {
      setMensaje("Selecciona el tipo de envío.");
      return;
    }

    if (!esUrlPublica(form.imagen)) {
      setMensaje("Ingresa una URL pública válida para la imagen.");
      return;
    }

    setCargando(true);

    try {
      await agregarProductoPublicado({
        ...form,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock)
      });

      navigate("/perfil", {
        state: {
          seccion: "publicaciones",
          mensaje: "Publicación creada correctamente."
        }
      });
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "No fue posible publicar el producto."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container fluid="xl" className="page-container">
      <Row className="g-4 align-items-start">
        <Col xl={3} lg={3}>
          <PerfilMenu seccionActiva="nueva" />
        </Col>

        <Col xl={6} lg={9}>
          <section className="publication-form-page">
            <header className="publication-form-header">
              <h1>Nueva publicación</h1>
              <p>
                Completa todos los campos para publicar tu producto.
              </p>
            </header>

            {mensaje && (
              <Alert variant="danger">
                {mensaje}
              </Alert>
            )}

            <Form onSubmit={submit}>
              <Form.Group>
                <Form.Label>
                  Título del producto <span className="required-mark">*</span>
                </Form.Label>
                <Form.Control
                  name="nombre"
                  value={form.nombre}
                  onChange={change}
                  placeholder="Ej: Audífonos inalámbricos Bluetooth"
                  maxLength={150}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Descripción <span className="required-mark">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descripcion"
                  value={form.descripcion}
                  onChange={change}
                  placeholder="Describe tu producto, sus características, medidas y detalles importantes."
                  maxLength={5000}
                  required
                />
              </Form.Group>

              <Row className="g-3">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>
                      Categoría <span className="required-mark">*</span>
                    </Form.Label>
                    <Form.Select
                      name="categoria"
                      value={form.categoria}
                      onChange={change}
                      required
                    >
                      <option value="">
                        Selecciona una categoría
                      </option>

                      {categorias.map((categoria) => (
                        <option
                          key={categoria.id}
                          value={categoria.nombre}
                        >
                          {categoria.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Estado <span className="required-mark">*</span>
                    </Form.Label>
                    <Form.Select
                      name="estado"
                      value={form.estado}
                      onChange={change}
                      required
                    >
                      <option value="Nuevo">Nuevo</option>
                      <option value="Usado">Usado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>
                      Stock <span className="required-mark">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      step="1"
                      name="stock"
                      value={form.stock}
                      onChange={change}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>
                  Precio (CLP) <span className="required-mark">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  name="precio"
                  value={
                    form.precio
                      ? `${formatearCLP(form.precio)}`
                      : ""
                  }
                  onChange={cambiarPrecio}
                  placeholder="Ej: $24.990"
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Tipo de envío <span className="required-mark">*</span>
                </Form.Label>
                <Form.Select
                  name="envio"
                  value={form.envio}
                  onChange={change}
                  required
                >
                  <option value="Envío a todo Chile">
                    Envío a todo Chile
                  </option>
                  <option value="Entrega en persona">
                    Entrega en persona
                  </option>
                  <option value="Envío acordado con vendedor">
                    Envío acordado con vendedor
                  </option>
                </Form.Select>

                <Form.Text className="publication-shipping-help">
                  Puedes ofrecer envío a todo Chile o entrega en persona.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Imagen del producto (URL){" "}
                  <span className="required-mark">*</span>
                </Form.Label>
                <Form.Control
                  type="url"
                  name="imagen"
                  value={form.imagen}
                  onChange={change}
                  placeholder="Pega aquí la URL pública de la imagen"
                  required
                />

                <Form.Text>
                  Asegúrate de utilizar una URL pública con protocolo
                  http o https.
                </Form.Text>
              </Form.Group>

              <Button
                type="submit"
                className="primary-action w-100"
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <Spinner size="sm" />
                    Publicando…
                  </>
                ) : (
                  "Publicar producto"
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                className="publication-cancel-button"
                onClick={() => navigate("/perfil")}
              >
                Cancelar
              </Button>
            </Form>
          </section>
        </Col>

        <Col xl={3}>
          <div className="publication-preview-column">
            <PublicacionPreview
              formulario={form}
              nombreUsuario={usuario?.nombre}
            />

            <aside className="publication-info-box">
              <strong>Información</strong>
              <p>
                Esta es una vista previa. Los cambios se reflejan
                al instante mientras completas el formulario.
              </p>
            </aside>

            <aside className="publication-note-box">
              <strong>Nota:</strong>
              <p>
                Todos los campos marcados con{" "}
                <span className="required-mark">*</span> son obligatorios.
              </p>
            </aside>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
