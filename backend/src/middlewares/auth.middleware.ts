import { IUser } from "@/models/User";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: Express.User | false) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Error de autenticación",
        });
        return;
      }

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Token inválido o expirado",
        });
        return;
      }

      req.user = user;

      next();
    }
  )(req, res, next);
};

export const requireRole = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const user = req.user as IUser;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "No tenés permisos para esta acción",
      });
      return;
    }

    next();
  };
};