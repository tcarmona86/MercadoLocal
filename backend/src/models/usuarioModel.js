import { pool, query } from "../config/db.js";

export const buscarUsuarioPorEmail = async (email) => {
  const { rows } = await query("SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1)", [email]);
  return rows[0];
};

export const buscarUsuarioPorId = async (id) => {
  const { rows } = await query("SELECT * FROM usuarios WHERE id = $1", [id]);
  return rows[0];
};

export const crearUsuario = async (data) => {
  const { rows } = await query(
    `INSERT INTO usuarios
      (nombre, apellido, rut, email, password_hash, foto, telefono, direccion, comuna, region, rol)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'cliente')
     RETURNING *`,
    [data.nombre, data.apellido, data.rut, data.email, data.password_hash, data.foto,
      data.telefono, data.direccion, data.comuna, data.region]
  );
  return rows[0];
};

export const actualizarUsuario = async (id, data) => {
  const { rows } = await query(
    `UPDATE usuarios SET
      nombre=$1, apellido=$2, rut=$3, telefono=$4, direccion=$5,
      comuna=$6, region=$7, foto=$8
     WHERE id=$9 RETURNING *`,
    [data.nombre, data.apellido, data.rut, data.telefono, data.direccion,
      data.comuna, data.region, data.foto, id]
  );
  return rows[0];
};

export const listarDirecciones = async (usuarioId) => {
  const { rows } = await query(
    `SELECT id, direccion, comuna, region, es_principal, fecha_creacion
     FROM direcciones WHERE usuario_id=$1
     ORDER BY es_principal DESC, fecha_creacion ASC`, [usuarioId]
  );
  return rows;
};

export const crearDireccion = async (usuarioId, data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (data.es_principal) {
      await client.query("UPDATE direcciones SET es_principal=FALSE WHERE usuario_id=$1", [usuarioId]);
    }
    const { rows } = await client.query(
      `INSERT INTO direcciones (usuario_id,direccion,comuna,region,es_principal)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [usuarioId, data.direccion, data.comuna, data.region, Boolean(data.es_principal)]
    );
    await client.query("COMMIT");
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
};

export const editarDireccion = async (usuarioId, direccionId, data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (data.es_principal) {
      await client.query("UPDATE direcciones SET es_principal=FALSE WHERE usuario_id=$1", [usuarioId]);
    }
    const { rows } = await client.query(
      `UPDATE direcciones SET direccion=$1, comuna=$2, region=$3, es_principal=$4
       WHERE id=$5 AND usuario_id=$6 RETURNING *`,
      [data.direccion, data.comuna, data.region, Boolean(data.es_principal), direccionId, usuarioId]
    );
    await client.query("COMMIT");
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
};

export const borrarDireccion = async (usuarioId, direccionId) => {
  const { rows } = await query(
    "DELETE FROM direcciones WHERE id=$1 AND usuario_id=$2 RETURNING *",
    [direccionId, usuarioId]
  );
  return rows[0];
};
