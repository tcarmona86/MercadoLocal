import { query } from "../config/db.js";

export const obtenerOCrearCarrito = async (usuarioId) => {
  const actual = await query(
    "SELECT * FROM carritos WHERE usuario_id=$1 AND estado='activo' LIMIT 1", [usuarioId]
  );
  if (actual.rows[0]) return actual.rows[0];
  const nuevo = await query(
    "INSERT INTO carritos (usuario_id,estado) VALUES ($1,'activo') RETURNING *", [usuarioId]
  );
  return nuevo.rows[0];
};

export const listarItems = async (carritoId) => {
  const { rows } = await query(
    `SELECT p.id, ci.producto_id, p.nombre, ci.precio_unitario::float AS precio,
      ci.cantidad, (ci.precio_unitario*ci.cantidad)::float AS subtotal, p.stock,
      COALESCE((SELECT pi.url_imagen FROM producto_imagenes pi
        WHERE pi.producto_id=p.id ORDER BY pi.orden LIMIT 1),'') AS imagen
     FROM carrito_items ci JOIN productos p ON p.id=ci.producto_id
     WHERE ci.carrito_id=$1 ORDER BY ci.fecha_creacion DESC`, [carritoId]
  );
  return rows;
};

export const agregarItem = async (carritoId, producto, cantidad) => {
  const { rows } = await query(
    `INSERT INTO carrito_items (carrito_id,producto_id,cantidad,precio_unitario)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (carrito_id,producto_id)
     DO UPDATE SET cantidad=carrito_items.cantidad+EXCLUDED.cantidad,
       precio_unitario=EXCLUDED.precio_unitario
     RETURNING *`, [carritoId,producto.id,cantidad,producto.precio]
  );
  return rows[0];
};

export const actualizarCantidad = async (carritoId, productoId, cantidad) => {
  const { rows } = await query(
    "UPDATE carrito_items SET cantidad=$1 WHERE carrito_id=$2 AND producto_id=$3 RETURNING *",
    [cantidad,carritoId,productoId]
  );
  return rows[0];
};

export const eliminarItem = async (carritoId, productoId) => {
  const { rows } = await query(
    "DELETE FROM carrito_items WHERE carrito_id=$1 AND producto_id=$2 RETURNING *",
    [carritoId,productoId]
  );
  return rows[0];
};

export const vaciarCarrito = (carritoId) => query("DELETE FROM carrito_items WHERE carrito_id=$1", [carritoId]);
