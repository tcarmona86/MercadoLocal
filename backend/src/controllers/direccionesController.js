import { borrarDireccion, crearDireccion, editarDireccion, listarDirecciones } from "../models/usuarioModel.js";
import { cleanText, isNonEmptyText, isValidId } from "../utils/validators.js";

const validate = (body) => isNonEmptyText(body.direccion,3,200) &&
  isNonEmptyText(body.comuna,2,100) && isNonEmptyText(body.region,2,100);
const clean = (body) => ({direccion:cleanText(body.direccion),comuna:cleanText(body.comuna),
  region:cleanText(body.region),es_principal:Boolean(body.es_principal)});

export const obtenerDirecciones = async (req,res,next) => {
  try { res.json({ok:true,direcciones:await listarDirecciones(req.usuario.id)}); }
  catch(error) { next(error); }
};
export const agregarDireccion = async (req,res,next) => {
  try {
    if (!validate(req.body)) return res.status(400).json({ok:false,mensaje:"Dirección, comuna y región son obligatorias."});
    res.status(201).json({ok:true,mensaje:"Dirección agregada.",direccion:await crearDireccion(req.usuario.id,clean(req.body))});
  } catch(error) { next(error); }
};
export const actualizarDireccion = async (req,res,next) => {
  try {
    if (!isValidId(req.params.id) || !validate(req.body)) return res.status(400).json({ok:false,mensaje:"Datos de dirección no válidos."});
    const result = await editarDireccion(req.usuario.id,req.params.id,clean(req.body));
    if (!result) return res.status(404).json({ok:false,mensaje:"Dirección no encontrada."});
    res.json({ok:true,mensaje:"Dirección actualizada.",direccion:result});
  } catch(error) { next(error); }
};
export const eliminarDireccion = async (req,res,next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ok:false,mensaje:"ID no válido."});
    const result = await borrarDireccion(req.usuario.id,req.params.id);
    if (!result) return res.status(404).json({ok:false,mensaje:"Dirección no encontrada."});
    res.json({ok:true,mensaje:"Dirección eliminada."});
  } catch(error) { next(error); }
};
