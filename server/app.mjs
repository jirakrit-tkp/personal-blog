import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routers
import apiRouter from "./routers/index.mjs";
import protectUser from "./middlewares/protectUser.mjs";
import protectAdmin from "./middlewares/protectAdmin.mjs";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Basic middlewares
app.use(
  cors({
    origin: [
      "https://jt-personal-blog.vercel.app", // ใส่โดเมนจริงจาก Vercel
      "https://personal-blog-b8cl4rym6-jirakrit-tkps-projects.vercel.app", // Vercel domain ใหม่
      "http://localhost:5173",            // ใช้ตอน dev
    ],
  })
);
app.use(express.json());

// API routes
app.use("/api", apiRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "JT Code Crumbs API",
    version: "1.0.0",
    endpoints: {
      health: "/api",
      posts: "/api/posts",
      profiles: "/api/profiles"
    }
  });
});

// Example protected routes
app.get("/protected-route", protectUser, (req, res) => {
  res.json({ message: "This is protected content", user: req.user });
});

app.get("/admin-only", protectAdmin, (req, res) => {
  res.json({ message: "This is admin-only content", admin: req.user });
});

// ✅ Start server (ต้องใช้ '0.0.0.0')
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
});
