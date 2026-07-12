import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table
} from "react-bootstrap";
import { useLocation } from "react-router-dom";

import PerfilMenu from "../components/PerfilMenu.jsx";
import useAuth from "../hooks/useAuth.js";
import useProducts from "../hooks/useProducts.js";
import { formatearCLP } from "../utils/formatters.js";

const seccionesPermitidas = [
  "datos",
  "direcciones",
  "publicaciones"
];

export default function Perfil() {
  const {
    usuario,
    actualizarPerfil,
    agregarDireccion,
    editarDireccion,
    eliminarDireccion
  } = useAuth();

  const {
    categorias,
    obtenerMisPublicaciones,
    editarProductoPublicado,
    eliminarProductoPublicado
  } = useProducts();

  const location = useLocation();

  const seccionInicial = seccionesPermitidas.includes(
    location.state?.seccion
  )
    ? location.state.seccion
    : "datos";

  const [tab, setTab] = useState(seccionInicial);
  const [mensaje, setMensaje] = useState(
    location.state?.mensaje || ""
  );
  const [cargando, setCargando] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [perfil, setPerfil] = useState({ ...usuario });
  const [direccion, setDireccion] = useState({
    id: null,
    direccion: "",
    comuna: "",
    region: "",
    es_principal: false
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    if (
      seccionesPermitidas.includes(location.state?.seccion)
    ) {
      setTab(location.state.seccion);
    }

    if (location.state?.mensaje) {
      setMensaje(location.state.mensaje);
    }
  }, [location.state]);

  const cargarPublicaciones = async () => {
    setCargando(true);

    try {
      setPublicaciones(
        await obtenerMisPublicaciones()
      );
    } catch {
      setMensaje("No fue posible cargar tus publicaciones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (tab === "publicaciones") {
      cargarPublicaciones();
    }
  }, [tab]);

  const guardarPerfil = async (evento) => {
    evento.preventDefault();
    setCargando(true);

    try {
      await actualizarPerfil(perfil);
      setMensaje("Perfil actualizado.");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "No se pudo actualizar."
      );
    } finally {
      setCargando(false);
    }
  };

  const guardarDireccion = async (evento) => {
    evento.preventDefault();
    setCargando(true);

    try {
      if (direccion.id) {
        await editarDireccion(direccion.id, direccion);
      } else {
        await agregarDireccion(direccion);
      }

      setDireccion({
        id: null,
        direccion: "",
        comuna: "",
        region: "",
        es_principal: false
      });

      setMensaje("Dirección guardada.");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "No se pudo guardar la dirección."
      );
    } finally {
      setCargando(false);
    }
  };

  const borrarDireccion = async (id) => {
    if (!window.confirm("¿Eliminar dirección?")) {
      return;
    }

    await eliminarDireccion(id);
    setMensaje("Dirección eliminada.");
  };

  const guardarProducto = async (evento) => {
    evento.preventDefault();

    try {
      await editarProductoPublicado(
        editando.id,
        {
          ...editando,
          precio: Number(editando.precio),
          stock: Number(editando.stock)
        }
      );

      setEditando(null);
      await cargarPublicaciones();
      setMensaje("Publicación actualizada.");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "No fue posible actualizar la publicación."
      );
    }
  };

  return (
    <Container fluid="xl" className="page-container">
      <Row className="g-4">
        <Col lg={3}>
          <PerfilMenu
            seccionActiva={tab}
            onSelect={setTab}
          />
        </Col>

        <Col lg={9}>
          <section className="profile-content-card">
            {mensaje && (
              <Alert variant="info">
                {mensaje}
              </Alert>
            )}

            {cargando && (
              <Spinner animation="border" />
            )}

            {tab === "datos" && (
              <>
                <h1>Datos personales</h1>

                <Form onSubmit={guardarPerfil}>
                  <Row>
                    {[
                      ["nombre", "Nombre"],
                      ["apellido", "Apellido"],
                      ["rut", "RUT"],
                      ["telefono", "Teléfono"],
                      ["direccion", "Dirección"],
                      ["comuna", "Comuna"],
                      ["region", "Región"]
                    ].map(([name, label]) => (
                      <Col md={6} key={name}>
                        <Form.Group className="mb-3">
                          <Form.Label>{label}</Form.Label>
                          <Form.Control
                            value={perfil[name] || ""}
                            onChange={(evento) =>
                              setPerfil({
                                ...perfil,
                                [name]: evento.target.value
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  <Button
                    type="submit"
                    className="primary-action"
                  >
                    Guardar cambios
                  </Button>
                </Form>
              </>
            )}

            {tab === "direcciones" && (
              <>
                <h1>Direcciones</h1>

                <Form
                  onSubmit={guardarDireccion}
                  className="mb-4"
                >
                  <Row className="g-3">
                    {[
                      ["direccion", "Dirección"],
                      ["comuna", "Comuna"],
                      ["region", "Región"]
                    ].map(([name, label]) => (
                      <Col md={4} key={name}>
                        <Form.Group>
                          <Form.Label>{label}</Form.Label>
                          <Form.Control
                            value={direccion[name]}
                            onChange={(evento) =>
                              setDireccion({
                                ...direccion,
                                [name]: evento.target.value
                              })
                            }
                            required
                          />
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  <Form.Check
                    className="my-3"
                    label="Dirección principal"
                    checked={direccion.es_principal}
                    onChange={(evento) =>
                      setDireccion({
                        ...direccion,
                        es_principal: evento.target.checked
                      })
                    }
                  />

                  <Button
                    type="submit"
                    className="primary-action"
                  >
                    {direccion.id ? "Actualizar" : "Agregar"}
                  </Button>
                </Form>

                {(usuario.direcciones || []).map((item) => (
                  <div
                    key={item.id}
                    className="address-row"
                  >
                    <div>
                      <strong>{item.direccion}</strong>
                      <br />
                      <span>
                        {item.comuna}, {item.region}
                      </span>
                    </div>

                    <div>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => setDireccion(item)}
                      >
                        Editar
                      </Button>{" "}

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => borrarDireccion(item.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {tab === "publicaciones" && (
              <>
                <div className="profile-section-header">
                  <h1>Mis publicaciones</h1>
                </div>

                {!cargando && publicaciones.length === 0 ? (
                  <Alert variant="info">
                    Aún no tienes publicaciones.
                  </Alert>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Estado</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {publicaciones.map((producto) => (
                        <tr key={producto.id}>
                          <td>{producto.nombre}</td>
                          <td>{producto.estado}</td>
                          <td>
                            {formatearCLP(producto.precio)}
                          </td>
                          <td>{producto.stock}</td>
                          <td>
                            <Button
                              size="sm"
                              onClick={() => setEditando(producto)}
                            >
                              Editar
                            </Button>{" "}

                            <Button
                              size="sm"
                              variant="danger"
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    "¿Eliminar publicación?"
                                  )
                                ) {
                                  await eliminarProductoPublicado(
                                    producto.id
                                  );
                                  await cargarPublicaciones();
                                }
                              }}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            )}
          </section>
        </Col>
      </Row>

      <Modal
        show={Boolean(editando)}
        onHide={() => setEditando(null)}
      >
        <Form onSubmit={guardarProducto}>
          <Modal.Header closeButton>
            <Modal.Title>Editar publicación</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {editando && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    value={editando.nombre || ""}
                    onChange={(evento) =>
                      setEditando({
                        ...editando,
                        nombre: evento.target.value
                      })
                    }
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio (CLP)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={editando.precio || ""}
                        onChange={(evento) =>
                          setEditando({
                            ...editando,
                            precio: evento.target.value
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        step="1"
                        value={editando.stock || ""}
                        onChange={(evento) =>
                          setEditando({
                            ...editando,
                            stock: evento.target.value
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={editando.categoria}
                    onChange={(evento) =>
                      setEditando({
                        ...editando,
                        categoria: evento.target.value
                      })
                    }
                    required
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select
                        value={editando.estado || "Nuevo"}
                        onChange={(evento) =>
                          setEditando({
                            ...editando,
                            estado: evento.target.value
                          })
                        }
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="Usado">Usado</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de envío</Form.Label>
                      <Form.Select
                        value={
                          editando.envio ||
                          "Envío acordado con vendedor"
                        }
                        onChange={(evento) =>
                          setEditando({
                            ...editando,
                            envio: evento.target.value
                          })
                        }
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
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Imagen URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={editando.imagen || ""}
                    onChange={(evento) =>
                      setEditando({
                        ...editando,
                        imagen: evento.target.value
                      })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editando.descripcion || ""}
                    onChange={(evento) =>
                      setEditando({
                        ...editando,
                        descripcion: evento.target.value
                      })
                    }
                    required
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setEditando(null)}
            >
              Cancelar
            </Button>

            <Button type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
