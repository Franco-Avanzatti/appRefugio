import { Request, Response } from "express";
import { IUser } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { User } from "../models/User";
import { ENV } from "../config/env";

//
// =========================
// GOOGLE CALLBACK
// =========================
//
export const googleCallback = (req: Request, res: Response): void => {
  console.log("GOOGLE CALLBACK EJECUTADO");

  const user = req.user as IUser;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  console.log("USUARIO:", user.email);

  res.redirect(
    `${ENV.CLIENT_URL}/--/auth?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );

};

//
// =========================
// GET ME
// =========================
//
export const getMe = (req: Request, res: Response): void => {
  const user = req.user as IUser;

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  });
};

//
// =========================
// REFRESH TOKEN ENDPOINT
// =========================
//
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const payload = verifyRefreshToken(token) as any;

    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({ message: "Usuario inválido" });
    }

    const newAccessToken = generateAccessToken(user);

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Refresh token inválido",
    });
  }
};