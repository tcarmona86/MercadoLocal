import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const useSsl = process.env.DB_SSL === "true" || process.env.NODE_ENV === "production";

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "mercadolocal_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: useSsl ? { rejectUnauthorized: false } : false
    };

export const pool = new Pool(config);

export const query = (text, params = []) => pool.query(text, params);

export const verificarConexion = async () => {
  const result = await query("SELECT NOW() AS fecha_servidor");
  return result.rows[0];
};
