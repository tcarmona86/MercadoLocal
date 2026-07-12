import { actualizarUsuario, buscarUsuarioPorId, listarDirecciones } from "../models/usuarioModel.js";
import { usuarioPublico } from "../helpers/usuarioHelper.js";
import { cleanText, isNonEmptyText, isOptionalUrl } from "../utils/validators.js";

export const obtenerPerfil = async (req,res,next) => {
  try {
    const usuario = await buscarUsuarioPorId(req.usuario.id);
    if (!usuario) return res.status(404).json({ok:false,mensaje:"Usuario no encontrado."});
    res.json({ok:true,usuario:usuarioPublico(usuario,await listarDirecciones(usuario.id))});
  } catch(error) { next(error); }
};

export const editarPerfil = async (req,res,next) => {
  try {
    const actual = await buscarUsuarioPorId(req.usuario.id);
    if (!actual) return res.status(404).json({ok:false,mensaje:"Usuario no encontrado."});
    const data = {
      nombre:req.body.nombre ?? actual.nombre, apellido:req.body.apellido ?? actual.apellido,
      rut:req.body.rut ?? actual.rut, telefono:req.body.telefono ?? actual.telefono,
      direccion:req.body.direccion ?? actual.direccion, comuna:req.body.comuna ?? actual.comuna,
      region:req.body.region ?? actual.region, foto:req.body.foto ?? actual.foto
    };
    if (!isNonEmptyText(data.nombre,2,100) || !isOptionalUrl(data.foto)) {
      return res.status(400).json({ok:false,mensaje:"Nombre o URL de foto no válidos."});
    }
    Object.keys(data).forEach(k => data[k]=cleanText(data[k]));
    const actualizado = await actualizarUsuario(req.usuario.id,data);
    res.json({ok:true,mensaje:"Perfil actualizado.",usuario:usuarioPublico(actualizado,await listarDirecciones(actualizado.id))});
  } catch(error) { next(error); }
};
