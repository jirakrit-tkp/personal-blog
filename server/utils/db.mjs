import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import * as pg from "pg";

// เอา __dirname มาใช้ เพราะ ESM ไม่มี __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// โหลด .env ก่อนทุกอย่าง
const envPath = path.resolve(__dirname, "../.env");
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('✅ .env loaded successfully');
}

const { Pool } = pg.default;

// Database configuration using connectionString with password from env
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log('Database connection string:', connectionString.replace(/:[^:@]*@/, ':***@')); // Hide password in logs
console.log('Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '***set***' : '***not set***'
});

const connectionPool = new Pool({
  connectionString: connectionString,
});

// Test connection
connectionPool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

connectionPool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
});

export default connectionPool;