import { Router } from "express";
import passport from "passport";
import { googleCallback, getMe, refreshToken } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/refresh", refreshToken);

// Inicia flujo Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/error" }),
  googleCallback
);

// Obtener usuario autenticado
router.get("/me", authMiddleware, getMe);

// Error handler
router.get("/error", (_req, res) => {
  res.status(401).json({ message: "Error en autenticación con Google" });
});

export default router;
