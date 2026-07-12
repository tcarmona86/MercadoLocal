import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { agregarCarritoApi, cambiarCantidadApi, crearOrdenApi, eliminarCarritoApi, obtenerCarritoApi, vaciarCarritoApi } from "../services/cartService.js";
import { getApiMessage } from "../services/api.js";
export const CartContext=createContext();
const empty={items:[],total:0,cantidadTotal:0};

export function CartProvider({children}){
 const {autenticado}=useContext(AuthContext); const [carrito,setCarrito]=useState(empty); const [cargandoCarrito,setCargandoCarrito]=useState(false); const [errorCarrito,setErrorCarrito]=useState("");
 const cargarCarrito=useCallback(async()=>{if(!autenticado){setCarrito(empty);return;}setCargandoCarrito(true);try{const d=await obtenerCarritoApi();setCarrito(d.carrito);setErrorCarrito("");}catch(e){setErrorCarrito(getApiMessage(e,"No fue posible cargar el carrito."));}finally{setCargandoCarrito(false);}},[autenticado]);
 useEffect(()=>{cargarCarrito();},[cargarCarrito]);
 const guard=()=>!autenticado?{ok:false,requiereLogin:true,mensaje:"Debes iniciar sesión para usar el carrito."}:null;
 const agregarProducto=async(producto,cantidad=1)=>{const denied=guard();if(denied)return denied;try{const d=await agregarCarritoApi(producto.id,cantidad);setCarrito(d.carrito);return{ok:true};}catch(e){return{ok:false,mensaje:getApiMessage(e,"No se pudo agregar el producto.")};}};
 const cambiarCantidad=async(id,cantidad)=>{try{const d=await cambiarCantidadApi(id,cantidad);setCarrito(d.carrito);return{ok:true};}catch(e){return{ok:false,mensaje:getApiMessage(e)};}};
 const sumarProducto=(item)=>cambiarCantidad(item.id,item.cantidad+1);
 const restarProducto=(item)=>item.cantidad>1?cambiarCantidad(item.id,item.cantidad-1):Promise.resolve({ok:true});
 const eliminarProducto=async(id)=>{const d=await eliminarCarritoApi(id);setCarrito(d.carrito);};
 const vaciarCarrito=async()=>{const d=await vaciarCarritoApi();setCarrito(d.carrito);};
 const pagar=async(payload)=>{const d=await crearOrdenApi(payload);setCarrito(empty);return d.orden;};
 const value=useMemo(()=>({carrito:carrito.items,total:carrito.total,cantidadTotal:carrito.cantidadTotal,cargandoCarrito,errorCarrito,cargarCarrito,agregarProducto,sumarProducto,restarProducto,cambiarCantidad,eliminarProducto,vaciarCarrito,pagar}),[carrito,cargandoCarrito,errorCarrito,cargarCarrito]);
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
