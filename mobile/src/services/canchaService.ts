import { api } from "./api";
import { Cancha } from "../types";

export const canchaService = {
  getCanchas: async (): Promise<Cancha[]> => {
    const { data } = await api.get("/canchas");
    return data;
  },
};
