import { query } from "../config/db.js";

export const buscarVendedorPorUsuario = async (usuarioId) => {
  const { rows } = await query("SELECT * FROM vendedores WHERE usuario_id=$1", [usuarioId]);
  return rows[0];
};

export const obtenerOCrearVendedor = async (usuario) => {
  const existente = await buscarVendedorPorUsuario(usuario.id);
  if (existente) return existente;

  const { rows } = await query(
    `INSERT INTO vendedores (usuario_id,nombre_tienda,descripcion,estado)
     VALUES ($1,$2,$3,'activo')
     ON CONFLICT (usuario_id) DO UPDATE SET nombre_tienda=EXCLUDED.nombre_tienda
     RETURNING *`,
    [usuario.id, `Tienda de ${usuario.nombre}`, "Perfil vendedor creado automáticamente."]
  );
  return rows[0];
};
