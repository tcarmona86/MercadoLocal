import { query } from "../config/db.js";

export const listarCategorias = async () => {
  const { rows } = await query(
    "SELECT id,nombre,descripcion,icono,imagen FROM categorias ORDER BY id"
  );
  return rows;
};

export const buscarCategoria = async ({ id, nombre }) => {
  const { rows } = id
    ? await query("SELECT * FROM categorias WHERE id=$1", [id])
    : await query("SELECT * FROM categorias WHERE LOWER(nombre)=LOWER($1)", [nombre]);
  return rows[0];
};
