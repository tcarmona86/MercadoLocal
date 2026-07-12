import { listarCategorias } from "../models/categoriaModel.js";
export const obtenerCategorias = async (req,res,next) => {
  try { res.json({ok:true,categorias:await listarCategorias()}); }
  catch(error) { next(error); }
};
