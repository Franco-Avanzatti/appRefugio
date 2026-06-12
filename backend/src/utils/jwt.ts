import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { IUser } from "../models/User";

//
// =========================
// ACCESS TOKEN (corto)
// =========================
//
export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    ENV.JWT_SECRET,
    { expiresIn: "15m" } // corto
  );
};

//
// =========================
// REFRESH TOKEN (largo)
// =========================
//
export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
    },
    ENV.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

//
// =========================
// VERIFY ACCESS TOKEN
// =========================
//
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

//
// =========================
// VERIFY REFRESH TOKEN
// =========================
//
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
};