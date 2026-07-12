import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { crearPublicacionApi, editarPublicacionApi, eliminarPublicacionApi, misPublicacionesApi, obtenerCategorias, obtenerProductos } from "../services/productService.js";
import { getApiMessage } from "../services/api.js";
export const ProductContext=createContext();

export function ProductProvider({children}){
 const [productos,setProductos]=useState([]); const [categorias,setCategorias]=useState([]);
 const [paginacion,setPaginacion]=useState({pagina:1,totalPaginas:1,total:0,limit:8});
 const [cargando,setCargando]=useState(true); const [error,setError]=useState("");
 const cargarProductos=useCallback(async(params={limit:100})=>{setCargando(true);setError("");try{const data=await obtenerProductos(params);setProductos(data.productos);setPaginacion(data.paginacion);return data;}catch(e){setError(getApiMessage(e,"No fue posible cargar productos."));return null;}finally{setCargando(false);}},[]);
 const cargarCategorias=useCallback(async()=>{try{const data=await obtenerCategorias();setCategorias(data.categorias);}catch(e){setError(getApiMessage(e,"No fue posible cargar categorías."));}},[]);
 useEffect(()=>{cargarCategorias();cargarProductos({limit:100});},[cargarCategorias,cargarProductos]);
 const obtenerMisPublicaciones=async()=> (await misPublicacionesApi()).productos;
 const agregarProductoPublicado=async(payload)=>{const data=await crearPublicacionApi(payload);await cargarProductos({limit:100});return data.producto;};
 const editarProductoPublicado=async(id,payload)=>{const data=await editarPublicacionApi(id,payload);await cargarProductos({limit:100});return data.producto;};
 const eliminarProductoPublicado=async(id)=>{await eliminarPublicacionApi(id);await cargarProductos({limit:100});};
 const value=useMemo(()=>({productos,categorias,paginacion,cargando,error,cargarProductos,cargarCategorias,obtenerMisPublicaciones,agregarProductoPublicado,editarProductoPublicado,eliminarProductoPublicado}),[productos,categorias,paginacion,cargando,error,cargarProductos,cargarCategorias]);
 return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
