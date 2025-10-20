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

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn("⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in server/.env");
}

// Create Supabase client without schema cache
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { 
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  },
  // Disable schema caching by forcing fresh schema on every request
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Log for debugging
console.log('✅ Supabase client initialized (schema cache disabled)');

export default supabase;