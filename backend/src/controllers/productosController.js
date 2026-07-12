import { listarProductos, obtenerProductoPorId } from "../models/productoModel.js";
import { isValidId } from "../utils/validators.js";

export const obtenerProductos = async (req,res,next) => {
  try { res.json({ok:true,...await listarProductos(req.query)}); }
  catch(error) { next(error); }
};
export const obtenerProducto = async (req,res,next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ok:false,mensaje:"ID no válido."});
    const producto = await obtenerProductoPorId(req.params.id);
    if (!producto) return res.status(404).json({ok:false,mensaje:"Producto no encontrado."});
    res.json({ok:true,producto});
  } catch(error) { next(error); }
};
