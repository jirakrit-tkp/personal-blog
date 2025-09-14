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
app.use(cors());
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

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
});