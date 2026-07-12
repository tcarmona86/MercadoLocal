import { buscarCategoria } from "../models/categoriaModel.js";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarPorVendedor,
  obtenerProductoDelVendedor
} from "../models/productoModel.js";
import { buscarUsuarioPorId } from "../models/usuarioModel.js";
import { obtenerOCrearVendedor } from "../models/vendedorModel.js";
import {
  cleanText,
  isNonEmptyText,
  isPositiveInteger,
  isPositiveNumber,
  isRequiredUrl,
  isValidId
} from "../utils/validators.js";

const ESTADOS_PERMITIDOS = ["Nuevo", "Usado"];

const categoriaId = async (body) =>
  (
    await buscarCategoria({
      id: body.categoria_id,
      nombre: body.categoria
    })
  )?.id;

const validate = (body) =>
  isNonEmptyText(body.nombre, 3, 150) &&
  isNonEmptyText(body.descripcion, 10, 5000) &&
  isPositiveNumber(body.precio) &&
  isPositiveInteger(body.stock) &&
  ESTADOS_PERMITIDOS.includes(
    cleanText(body.estado)
  ) &&
  isNonEmptyText(body.envio, 3, 120) &&
  isRequiredUrl(body.imagen);

const payload = (body, id) => ({
  categoria_id: id,
  nombre: cleanText(body.nombre),
  descripcion: cleanText(body.descripcion),
  precio: Number(body.precio),
  stock: Number(body.stock),
  estado: cleanText(body.estado),
  envio: cleanText(body.envio),
  imagen: cleanText(body.imagen)
});

const seller = async (userId) =>
  obtenerOCrearVendedor(
    await buscarUsuarioPorId(userId)
  );

export const crearPublicacion = async (
  req,
  res,
  next
) => {
  try {
    if (!validate(req.body)) {
      return res.status(400).json({
        ok: false,
        mensaje:
          "Revisa título, descripción, categoría, estado, precio, stock, envío e imagen."
      });
    }

    const catId = await categoriaId(req.body);

    if (!catId) {
      return res.status(400).json({
        ok: false,
        mensaje: "Categoría no encontrada."
      });
    }

    const vendedor = await seller(req.usuario.id);

    const producto = await crearProducto({
      ...payload(req.body, catId),
      vendedor_id: vendedor.id
    });

    res.status(201).json({
      ok: true,
      mensaje: "Publicación creada.",
      producto
    });
  } catch (error) {
    next(error);
  }
};

export const misPublicaciones = async (
  req,
  res,
  next
) => {
  try {
    const vendedor = await seller(req.usuario.id);

    res.json({
      ok: true,
      productos: await listarPorVendedor(vendedor.id)
    });
  } catch (error) {
    next(error);
  }
};

export const miPublicacion = async (
  req,
  res,
  next
) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID no válido."
      });
    }

    const vendedor = await seller(req.usuario.id);

    const producto = await obtenerProductoDelVendedor(
      req.params.id,
      vendedor.id
    );

    if (!producto) {
      return res.status(404).json({
        ok: false,
        mensaje: "Publicación no encontrada."
      });
    }

    res.json({
      ok: true,
      producto
    });
  } catch (error) {
    next(error);
  }
};

export const editarPublicacion = async (
  req,
  res,
  next
) => {
  try {
    if (
      !isValidId(req.params.id) ||
      !validate(req.body)
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Datos de publicación no válidos."
      });
    }

    const catId = await categoriaId(req.body);

    if (!catId) {
      return res.status(400).json({
        ok: false,
        mensaje: "Categoría no encontrada."
      });
    }

    const vendedor = await seller(req.usuario.id);

    const producto = await actualizarProducto(
      req.params.id,
      vendedor.id,
      payload(req.body, catId)
    );

    if (!producto) {
      return res.status(404).json({
        ok: false,
        mensaje: "Publicación no encontrada."
      });
    }

    res.json({
      ok: true,
      mensaje: "Publicación actualizada.",
      producto
    });
  } catch (error) {
    next(error);
  }
};

export const borrarPublicacion = async (
  req,
  res,
  next
) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID no válido."
      });
    }

    const vendedor = await seller(req.usuario.id);

    const result = await eliminarProducto(
      req.params.id,
      vendedor.id
    );

    if (!result) {
      return res.status(404).json({
        ok: false,
        mensaje: "Publicación no encontrada."
      });
    }

    res.json({
      ok: true,
      mensaje: "Publicación eliminada."
    });
  } catch (error) {
    next(error);
  }
};
