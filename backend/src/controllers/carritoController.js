import { agregarItem, actualizarCantidad, eliminarItem, listarItems, obtenerOCrearCarrito, vaciarCarrito as clear } from "../models/carritoModel.js";
import { obtenerProductoPorId } from "../models/productoModel.js";
import { isPositiveInteger, isValidId } from "../utils/validators.js";

const response = async (usuarioId) => {
  const carrito=await obtenerOCrearCarrito(usuarioId); const items=await listarItems(carrito.id);
  return {usuario_id:usuarioId,items,total:items.reduce((s,i)=>s+Number(i.subtotal),0),
    cantidadTotal:items.reduce((s,i)=>s+Number(i.cantidad),0)};
};
export const obtenerCarrito = async (req,res,next) => { try { res.json({ok:true,carrito:await response(req.usuario.id)}); } catch(e){next(e);} };
export const agregarProducto = async (req,res,next) => {
  try {
    if (!isValidId(req.body.producto_id) || !isPositiveInteger(req.body.cantidad)) return res.status(400).json({ok:false,mensaje:"Producto y cantidad válidos son obligatorios."});
    const producto=await obtenerProductoPorId(req.body.producto_id);
    if (!producto) return res.status(404).json({ok:false,mensaje:"Producto no encontrado."});
    const carrito=await obtenerOCrearCarrito(req.usuario.id); const actuales=await listarItems(carrito.id);
    const current=actuales.find(i=>i.producto_id===producto.id)?.cantidad || 0;
    if (current+Number(req.body.cantidad)>producto.stock) return res.status(409).json({ok:false,mensaje:"La cantidad supera el stock disponible."});
    await agregarItem(carrito.id,producto,Number(req.body.cantidad));
    res.status(201).json({ok:true,mensaje:"Producto agregado.",carrito:await response(req.usuario.id)});
  } catch(e){next(e);}
};
export const cambiarCantidad = async (req,res,next) => {
  try {
    if (!isValidId(req.params.producto_id)||!isPositiveInteger(req.body.cantidad)) return res.status(400).json({ok:false,mensaje:"Producto o cantidad no válidos."});
    const producto=await obtenerProductoPorId(req.params.producto_id);
    if (!producto) return res.status(404).json({ok:false,mensaje:"Producto no encontrado."});
    if (Number(req.body.cantidad)>producto.stock) return res.status(409).json({ok:false,mensaje:"La cantidad supera el stock disponible."});
    const carrito=await obtenerOCrearCarrito(req.usuario.id);
    if (!await actualizarCantidad(carrito.id,req.params.producto_id,Number(req.body.cantidad))) return res.status(404).json({ok:false,mensaje:"Producto no está en el carrito."});
    res.json({ok:true,mensaje:"Cantidad actualizada.",carrito:await response(req.usuario.id)});
  } catch(e){next(e);}
};
export const quitarProducto = async (req,res,next) => {
  try {
    if (!isValidId(req.params.producto_id)) return res.status(400).json({ok:false,mensaje:"ID no válido."});
    const carrito=await obtenerOCrearCarrito(req.usuario.id);
    if (!await eliminarItem(carrito.id,req.params.producto_id)) return res.status(404).json({ok:false,mensaje:"Producto no está en el carrito."});
    res.json({ok:true,mensaje:"Producto eliminado.",carrito:await response(req.usuario.id)});
  } catch(e){next(e);}
};
export const vaciarCarrito = async (req,res,next) => {
  try { const c=await obtenerOCrearCarrito(req.usuario.id); await clear(c.id); res.json({ok:true,mensaje:"Carrito vaciado.",carrito:await response(req.usuario.id)}); }
  catch(e){next(e);}
};
