import axios from "axios";
import { API_URL } from "../constants";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// REFRESH LOGIC
// =========================
async function refreshAccessToken() {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  if (!refreshToken) throw new Error("No refresh token");

  const response = await axios.post(`${API_URL}/auth/refresh`, {
    refreshToken,
  });

  const newAccessToken = response.data.accessToken;

  await SecureStore.setItemAsync("accessToken", newAccessToken);

  return newAccessToken;
}

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("user");
      }
    }

    return Promise.reject(error);
  }
);