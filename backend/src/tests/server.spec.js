import request from "supertest";

import app from "../app.js";
import { pool } from "../config/db.js";

afterAll(async () => {
  await pool.end();
});

describe("API MercadoLocal - códigos de estado", () => {
  test("GET /api/health responde 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  test("POST /api/usuarios con datos incompletos responde 400", async () => {
    const response = await request(app)
      .post("/api/usuarios")
      .send({
        email: "incorrecto"
      });

    expect(response.statusCode).toBe(400);
  });

  test("POST /api/usuarios rechaza contraseña débil con 400", async () => {
    const response = await request(app)
      .post("/api/usuarios")
      .send({
        nombre: "Usuario",
        email: "usuario.debil@ejemplo.cl",
        password: "12345678"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.mensaje).toMatch(
      /mayúscula/i
    );
  });

  test("POST /api/login sin credenciales responde 400", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({});

    expect(response.statusCode).toBe(400);
  });

  test("GET /api/perfil sin JWT responde 401", async () => {
    const response = await request(app)
      .get("/api/perfil");

    expect(response.statusCode).toBe(401);
  });

  test("POST /api/publicaciones sin JWT responde 401", async () => {
    const response = await request(app)
      .post("/api/publicaciones")
      .send({});

    expect(response.statusCode).toBe(401);
  });

  test("GET /api/ruta-inexistente responde 404", async () => {
    const response = await request(app)
      .get("/api/ruta-inexistente");

    expect(response.statusCode).toBe(404);
  });
});
