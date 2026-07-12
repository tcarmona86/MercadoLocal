import { pool, query } from "../config/db.js";

export const crearOrdenDesdeCarrito = async (usuarioId, data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const carritoResult = await client.query(
      "SELECT * FROM carritos WHERE usuario_id=$1 AND estado='activo' FOR UPDATE", [usuarioId]
    );
    const carrito = carritoResult.rows[0];
    if (!carrito) {
      const error = new Error("El carrito está vacío."); error.status=400; throw error;
    }

    const itemsResult = await client.query(
      `SELECT ci.producto_id,ci.cantidad,ci.precio_unitario::float AS precio,
        p.nombre,p.stock,p.activo
       FROM carrito_items ci JOIN productos p ON p.id=ci.producto_id
       WHERE ci.carrito_id=$1 FOR UPDATE OF p`, [carrito.id]
    );
    const items = itemsResult.rows;
    if (!items.length) {
      const error = new Error("El carrito está vacío."); error.status=400; throw error;
    }

    for (const item of items) {
      if (!item.activo || item.cantidad > item.stock) {
        const error = new Error(`Stock insuficiente para ${item.nombre}.`); error.status=409; throw error;
      }
    }

    const total = items.reduce((sum,item) => sum + item.precio*item.cantidad, 0);
    const orderResult = await client.query(
      `INSERT INTO ordenes
       (comprador_id,nombre,apellido,email,rut,direccion_envio,comuna_envio,
        region_envio,metodo_pago,total,estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'confirmada') RETURNING *`,
      [usuarioId,data.nombre,data.apellido,data.email,data.rut,data.direccion_envio,
        data.comuna_envio,data.region_envio,data.metodo_pago,total]
    );
    const orden = orderResult.rows[0];

    for (const item of items) {
      const subtotal = item.precio*item.cantidad;
      await client.query(
        `INSERT INTO orden_items (orden_id,producto_id,nombre,precio,cantidad,subtotal)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [orden.id,item.producto_id,item.nombre,item.precio,item.cantidad,subtotal]
      );
      await client.query("UPDATE productos SET stock=stock-$1 WHERE id=$2", [item.cantidad,item.producto_id]);
    }

    await client.query(
      `INSERT INTO pagos (orden_id,metodo_pago,monto,estado,fecha_pago)
       VALUES ($1,$2,$3,'aprobado',CURRENT_TIMESTAMP)`, [orden.id,data.metodo_pago,total]
    );
    await client.query("DELETE FROM carrito_items WHERE carrito_id=$1", [carrito.id]);
    await client.query("UPDATE carritos SET estado='convertido_en_orden' WHERE id=$1", [carrito.id]);
    await client.query("COMMIT");

    return {...orden, total:Number(orden.total), items:items.map(i => ({
      producto_id:i.producto_id,nombre:i.nombre,precio:i.precio,cantidad:i.cantidad,
      subtotal:i.precio*i.cantidad
    }))};
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
};

export const listarOrdenes = async (usuarioId) => {
  const { rows } = await query(
    `SELECT o.id,o.fecha_compra,o.total::float AS total,o.estado,
      COUNT(oi.id)::int AS items_cantidad
     FROM ordenes o LEFT JOIN orden_items oi ON oi.orden_id=o.id
     WHERE o.comprador_id=$1 GROUP BY o.id ORDER BY o.fecha_compra DESC`, [usuarioId]
  );
  return rows;
};

export const obtenerOrden = async (usuarioId,id) => {
  const order = await query(
    `SELECT id,comprador_id,nombre,apellido,email,rut,direccion_envio,comuna_envio,
      region_envio,metodo_pago,total::float AS total,estado,fecha_compra
     FROM ordenes WHERE comprador_id=$1 AND id=$2`, [usuarioId,id]
  );
  if (!order.rows[0]) return null;
  const items = await query(
    `SELECT producto_id,nombre,precio::float AS precio,cantidad,subtotal::float AS subtotal
     FROM orden_items WHERE orden_id=$1 ORDER BY id`, [id]
  );
  return {...order.rows[0],items:items.rows};
};
