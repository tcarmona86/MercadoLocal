import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { actualizarPerfilApi, crearDireccionApi, direccionesApi, editarDireccionApi, eliminarDireccionApi, loginApi, perfilApi, registrarApi } from "../services/authService.js";
import { getApiMessage } from "../services/api.js";

export const AuthContext=createContext();
const TOKEN_KEY="mercadolocal_token"; const USER_KEY="mercadolocal_usuario";

export function AuthProvider({children}) {
  const [usuario,setUsuario]=useState(()=>JSON.parse(localStorage.getItem(USER_KEY)||"null"));
  const [cargandoAuth,setCargandoAuth]=useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [errorAuth,setErrorAuth]=useState("");
  const autenticado=Boolean(usuario && localStorage.getItem(TOKEN_KEY));

  const persist=(token,user)=>{ if(token)localStorage.setItem(TOKEN_KEY,token); localStorage.setItem(USER_KEY,JSON.stringify(user)); setUsuario(user); };
  const cerrarSesion=useCallback(()=>{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);setUsuario(null);setErrorAuth("");},[]);

  useEffect(()=>{
    const restore=async()=>{ if(!localStorage.getItem(TOKEN_KEY)){setCargandoAuth(false);return;} try{const data=await perfilApi();persist(null,data.usuario);}catch{cerrarSesion();}finally{setCargandoAuth(false);} };
    restore(); window.addEventListener("mercadolocal:logout",cerrarSesion); return()=>window.removeEventListener("mercadolocal:logout",cerrarSesion);
  },[cerrarSesion]);

  const iniciarSesion=async(email,password)=>{setErrorAuth("");try{const data=await loginApi({email,password});persist(data.token,data.usuario);return{ok:true};}catch(e){const mensaje=getApiMessage(e,"No fue posible iniciar sesión.");setErrorAuth(mensaje);return{ok:false,mensaje};}};
  const registrarUsuario=async(payload)=>{setErrorAuth("");try{const data=await registrarApi(payload);persist(data.token,data.usuario);return{ok:true};}catch(e){const mensaje=getApiMessage(e,"No fue posible crear la cuenta.");setErrorAuth(mensaje);return{ok:false,mensaje};}};
  const actualizarPerfil=async(payload)=>{const data=await actualizarPerfilApi(payload);persist(null,data.usuario);return data.usuario;};
  const recargarDirecciones=async()=>{const data=await direccionesApi();const next={...usuario,direcciones:data.direcciones};persist(null,next);return data.direcciones;};
  const agregarDireccion=async(payload)=>{await crearDireccionApi(payload);return recargarDirecciones();};
  const editarDireccion=async(id,payload)=>{await editarDireccionApi(id,payload);return recargarDirecciones();};
  const eliminarDireccion=async(id)=>{await eliminarDireccionApi(id);return recargarDirecciones();};

  const value=useMemo(()=>({usuario,autenticado,cargandoAuth,errorAuth,iniciarSesion,registrarUsuario,cerrarSesion,actualizarPerfil,agregarDireccion,editarDireccion,eliminarDireccion}),[usuario,autenticado,cargandoAuth,errorAuth,cerrarSesion]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
