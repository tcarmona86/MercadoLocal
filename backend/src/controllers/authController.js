import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  buscarUsuarioPorEmail,
  crearUsuario,
  listarDirecciones
} from "../models/usuarioModel.js";
import { usuarioPublico } from "../helpers/usuarioHelper.js";
import {
  cleanText,
  isEmail,
  isNonEmptyText,
  isStrongPassword
} from "../utils/validators.js";

const tokenFor = (usuario) =>
  jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "2h"
    }
  );

export const registrar = async (req, res, next) => {
  try {
    const {
      nombre,
      apellido = "",
      rut = "",
      email,
      password,
      foto = "",
      telefono = "",
      direccion = "",
      comuna = "",
      region = ""
    } = req.body;

    if (!isNonEmptyText(nombre, 2, 100)) {
      return res.status(400).json({
        ok: false,
        mensaje:
          "El nombre debe tener entre 2 y 100 caracteres."
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Ingresa un correo electrónico válido."
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        ok: false,
        mensaje:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      });
    }

    if (await buscarUsuarioPorEmail(email)) {
      return res.status(409).json({
        ok: false,
        mensaje: "El correo ya está registrado."
      });
    }

    const usuario = await crearUsuario({
      nombre: cleanText(nombre),
      apellido: cleanText(apellido),
      rut: cleanText(rut),
      email: cleanText(email).toLowerCase(),
      password_hash: await bcrypt.hash(password, 10),
      foto: cleanText(foto),
      telefono: cleanText(telefono),
      direccion: cleanText(direccion),
      comuna: cleanText(comuna),
      region: cleanText(region)
    });

    const publicUser = usuarioPublico(usuario, []);

    res.status(201).json({
      ok: true,
      mensaje: "Cuenta creada correctamente.",
      token: tokenFor(publicUser),
      usuario: publicUser
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      !isEmail(email) ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Email y contraseña son obligatorios."
      });
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (
      !usuario ||
      !usuario.activo ||
      !(await bcrypt.compare(
        password,
        usuario.password_hash
      ))
    ) {
      return res.status(401).json({
        ok: false,
        mensaje: "Correo o contraseña incorrectos."
      });
    }

    const direcciones = await listarDirecciones(
      usuario.id
    );

    const publicUser = usuarioPublico(
      usuario,
      direcciones
    );

    res.json({
      ok: true,
      mensaje: "Inicio de sesión correcto.",
      token: tokenFor(publicUser),
      usuario: publicUser
    });
  } catch (error) {
    next(error);
  }
};
