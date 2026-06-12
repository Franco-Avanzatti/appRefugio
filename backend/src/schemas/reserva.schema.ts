import { z } from "zod";

/**
 * DTO de entrada (lo que puede enviar el frontend)
 * SOLO datos mínimos necesarios para crear una reserva
 */
export const createReservaSchema = z.object({
  cancha: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID de cancha inválido"),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),

  inicio: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):(00|30)$/,
      "Horario inválido (ej: 08:00 o 08:30)"
    ),
});

/**
 * Tipo inferido del DTO
 */
export type CreateReservaDto = z.infer<typeof createReservaSchema>;