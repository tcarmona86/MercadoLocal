import { crearOrdenDesdeCarrito, listarOrdenes, obtenerOrden } from "../models/ordenModel.js";
import { buscarUsuarioPorId } from "../models/usuarioModel.js";
import { cleanText, isEmail, isNonEmptyText, isValidId } from "../utils/validators.js";

export const crearOrden = async (req,res,next) => {
  try {
    const user=await buscarUsuarioPorId(req.usuario.id);
    const data={
      nombre:cleanText(req.body.nombre || user.nombre),apellido:cleanText(req.body.apellido || user.apellido),
      email:cleanText(req.body.email || user.email),rut:cleanText(req.body.rut || user.rut),
      direccion_envio:cleanText(req.body.direccion_envio || user.direccion),
      comuna_envio:cleanText(req.body.comuna_envio || user.comuna),region_envio:cleanText(req.body.region_envio || user.region),
      metodo_pago:cleanText(req.body.metodo_pago)
    };
    if (!isNonEmptyText(data.nombre,2,100)||!isEmail(data.email)||!isNonEmptyText(data.direccion_envio,3,200)||!isNonEmptyText(data.metodo_pago,2,50)) {
      return res.status(400).json({ok:false,mensaje:"Completa nombre, email, dirección y método de pago."});
    }
    res.status(201).json({ok:true,mensaje:"Compra realizada.",orden:await crearOrdenDesdeCarrito(req.usuario.id,data)});
  } catch(e){next(e);}
};
export const obtenerOrdenes = async (req,res,next) => { try{res.json({ok:true,ordenes:await listarOrdenes(req.usuario.id)});}catch(e){next(e);} };
export const obtenerOrdenPorId = async (req,res,next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ok:false,mensaje:"ID no válido."});
    const orden=await obtenerOrden(req.usuario.id,req.params.id);
    if (!orden) return res.status(404).json({ok:false,mensaje:"Orden no encontrada."});
    res.json({ok:true,orden});
  } catch(e){next(e);}
};
