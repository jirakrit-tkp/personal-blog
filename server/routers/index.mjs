import express from "express";
import postsRouter from "./posts.mjs";
import profilesRouter from "./profiles.mjs";
import authRouter from "./auth.mjs";

const router = express.Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JT Code Crumbs API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Mount routers
router.use("/posts", postsRouter);
router.use("/profiles", profilesRouter);
router.use("/auth", authRouter);

export default router;
