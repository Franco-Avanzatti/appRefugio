import { z } from "zod";

export const createCanchaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),

  descripcion: z.string().optional(),

  activa: z.boolean().optional(),

  techada: z.boolean().optional(),
});

export type CreateCanchaDto = z.infer<typeof createCanchaSchema>;