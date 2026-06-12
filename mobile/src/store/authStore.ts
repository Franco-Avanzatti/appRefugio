import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync("accessToken", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));

    set(() => ({
      user,
      token,
    }));
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("user");

    set(() => ({
      user: null,
      token: null,
    }));
  },

  loadAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const userStr = await SecureStore.getItemAsync("user");

      if (token && userStr) {
        set(() => ({
          token,
          user: JSON.parse(userStr),
        }));
      } else {
        set(() => ({
          token: null,
          user: null,
        }));
      }
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
}));