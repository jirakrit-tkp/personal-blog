import { createClient } from "@supabase/supabase-js";
import supabaseService from "../utils/db.mjs";

// Use anon key client to decode token; use service client to read roles if needed
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const protectAdmin = async (req, res, next) => {
  const header = req.headers && (req.headers.authorization || req.headers.Authorization);
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const { data, error } = await supabaseAnon.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const userId = data.user.id;
    const { data: rows, error: dbErr } = await supabaseService
      .from("users")
      .select("role")
      .eq("id", userId)
      .limit(1);
    if (dbErr || !rows || rows.length === 0) {
      return res.status(404).json({ error: "User role not found" });
    }

    const role = rows[0].role;
    req.user = { ...data.user, role };

    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden: You do not have admin access" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default protectAdmin;


