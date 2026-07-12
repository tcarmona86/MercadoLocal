import format from "pg-format";
import { query } from "../config/db.js";

const SELECT_PRODUCTO = `
  p.id, p.nombre, p.precio::float AS precio, c.nombre AS categoria,
  p.descripcion, p.stock, p.estado, u.nombre AS vendedor,
  u.id AS "vendedorId", p.envio,
  COALESCE((SELECT pi.url_imagen FROM producto_imagenes pi
    WHERE pi.producto_id=p.id ORDER BY pi.orden LIMIT 1),'') AS imagen`;

const ORDER_COLUMNS = {
  nombre: "p.nombre",
  precio: "p.precio",
  stock: "p.stock",
  fecha: "p.fecha_creacion",
  fecha_creacion: "p.fecha_creacion"
};

export const listarProductos = async (filters = {}) => {
  const params = [];
  const conditions = ["p.activo=TRUE"];

  if (filters.categoria) {
    params.push(filters.categoria);
    conditions.push(`LOWER(c.nombre)=LOWER($${params.length})`);
  }
  if (filters.buscar) {
    params.push(`%${filters.buscar}%`);
    conditions.push(`(p.nombre ILIKE $${params.length} OR p.descripcion ILIKE $${params.length})`);
  }
  if (filters.precio_min !== undefined && filters.precio_min !== "") {
    params.push(Number(filters.precio_min));
    conditions.push(`p.precio >= $${params.length}`);
  }
  if (filters.precio_max !== undefined && filters.precio_max !== "") {
    params.push(Number(filters.precio_max));
    conditions.push(`p.precio <= $${params.length}`);
  }

  const pagina = Math.max(1, Number(filters.pagina) || 1);
  const limite = Math.min(100, Math.max(1, Number(filters.limit) || 8));
  const offset = (pagina - 1) * limite;
  const [rawColumn="fecha", rawDirection="DESC"] = String(filters.order_by || "fecha_DESC").split("_");
  const column = ORDER_COLUMNS[rawColumn] || ORDER_COLUMNS.fecha;
  const direction = rawDirection.toUpperCase() === "ASC" ? "ASC" : "DESC";
  // column y direction provienen de listas blancas; pg-format no recibe entrada libre.
  const orderClause = format("ORDER BY %s %s", column, direction);

  const count = await query(
    `SELECT COUNT(*)::int AS total FROM productos p
     JOIN categorias c ON c.id=p.categoria_id
     WHERE ${conditions.join(" AND ")}`,
    params
  );

  params.push(limite);
  const limitPos = params.length;
  params.push(offset);
  const offsetPos = params.length;

  const { rows } = await query(
    `SELECT ${SELECT_PRODUCTO}
     FROM productos p
     JOIN categorias c ON c.id=p.categoria_id
     JOIN vendedores v ON v.id=p.vendedor_id
     JOIN usuarios u ON u.id=v.usuario_id
     WHERE ${conditions.join(" AND ")}
     ${orderClause}
     LIMIT $${limitPos} OFFSET $${offsetPos}`,
    params
  );

  return {
    productos: rows,
    paginacion: {
      pagina,
      limit: limite,
      total: count.rows[0].total,
      totalPaginas: Math.max(1, Math.ceil(count.rows[0].total / limite))
    }
  };
};

export const obtenerProductoPorId = async (id, { includeInactive = false } = {}) => {
  const { rows } = await query(
    `SELECT ${SELECT_PRODUCTO}
     FROM productos p
     JOIN categorias c ON c.id=p.categoria_id
     JOIN vendedores v ON v.id=p.vendedor_id
     JOIN usuarios u ON u.id=v.usuario_id
     WHERE p.id=$1 ${includeInactive ? "" : "AND p.activo=TRUE"}`,
    [id]
  );
  return rows[0];
};

export const listarPorVendedor = async (vendedorId) => {
  const { rows } = await query(
    `SELECT ${SELECT_PRODUCTO}
     FROM productos p
     JOIN categorias c ON c.id=p.categoria_id
     JOIN vendedores v ON v.id=p.vendedor_id
     JOIN usuarios u ON u.id=v.usuario_id
     WHERE p.vendedor_id=$1 AND p.activo=TRUE ORDER BY p.fecha_creacion DESC`,
    [vendedorId]
  );
  return rows;
};

export const obtenerProductoDelVendedor = async (id, vendedorId) => {
  const { rows } = await query(
    `SELECT ${SELECT_PRODUCTO}
     FROM productos p
     JOIN categorias c ON c.id=p.categoria_id
     JOIN vendedores v ON v.id=p.vendedor_id
     JOIN usuarios u ON u.id=v.usuario_id
     WHERE p.id=$1 AND p.vendedor_id=$2 AND p.activo=TRUE`, [id, vendedorId]
  );
  return rows[0];
};

export const crearProducto = async (data) => {
  const { rows } = await query(
    `INSERT INTO productos
      (vendedor_id,categoria_id,nombre,descripcion,precio,stock,estado,envio)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [data.vendedor_id,data.categoria_id,data.nombre,data.descripcion,data.precio,
      data.stock,data.estado,data.envio]
  );
  if (data.imagen) {
    await query("INSERT INTO producto_imagenes (producto_id,url_imagen,orden) VALUES ($1,$2,1)", [rows[0].id,data.imagen]);
  }
  return obtenerProductoPorId(rows[0].id);
};

export const actualizarProducto = async (id, vendedorId, data) => {
  const { rows } = await query(
    `UPDATE productos SET categoria_id=$1,nombre=$2,descripcion=$3,precio=$4,
      stock=$5,estado=$6,envio=$7
     WHERE id=$8 AND vendedor_id=$9 AND activo=TRUE RETURNING id`,
    [data.categoria_id,data.nombre,data.descripcion,data.precio,data.stock,
      data.estado,data.envio,id,vendedorId]
  );
  if (!rows[0]) return null;
  if (data.imagen !== undefined) {
    await query("DELETE FROM producto_imagenes WHERE producto_id=$1", [id]);
    if (data.imagen) {
      await query("INSERT INTO producto_imagenes (producto_id,url_imagen,orden) VALUES ($1,$2,1)", [id,data.imagen]);
    }
  }
  return obtenerProductoDelVendedor(id,vendedorId);
};

export const eliminarProducto = async (id,vendedorId) => {
  const { rows } = await query(
    "UPDATE productos SET activo=FALSE WHERE id=$1 AND vendedor_id=$2 AND activo=TRUE RETURNING id",
    [id,vendedorId]
  );
  return rows[0];
};
