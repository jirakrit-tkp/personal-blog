import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routers
import apiRouter from "./routers/index.mjs";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Basic middlewares
app.use(
  cors({
    origin: [
      "https://jt-personal-blog.vercel.app", // ใส่โดเมนจริงจาก Vercel
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

// ✅ Start server (ต้องใช้ '0.0.0.0')
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
});
