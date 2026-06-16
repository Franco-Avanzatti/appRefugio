import { Router } from "express";
import { User } from "../models/User";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  async (_req, res, next) => {
    try {
      const users = await User.find()
        .select("name email avatar role createdAt")
        .sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

export default router;