import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const protectUser = async (req, res, next) => {
  const header = req.headers && (req.headers.authorization || req.headers.Authorization);
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.log('❌ Auth failed:', error?.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = { ...data.user };
    next();
  } catch (err) {
    console.error('❌ Middleware error:', err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default protectUser;


