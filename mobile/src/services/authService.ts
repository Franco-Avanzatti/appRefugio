import { api } from "./api";
import { User } from "../types";

export const authService = {
  getMe: async (): Promise<User> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
