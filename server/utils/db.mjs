import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (server/.env)
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("🔍 Debug Supabase Config:");
console.log("  - SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing");
console.log("  - SERVICE_ROLE_KEY:", supabaseServiceRoleKey ? `✅ Found (${supabaseServiceRoleKey.substring(0, 20)}...)` : "❌ Missing");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn("⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in server/.env");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { 
    persistSession: false,
    autoRefreshToken: false
  }
});

export default supabase;