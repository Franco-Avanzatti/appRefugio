import mongoose, { Document, Schema } from "mongoose";

export interface IReserva extends Document {
  cancha: mongoose.Types.ObjectId;

  numeroCancha: number;
  nombreCancha: string;
  techada: boolean;

  usuario: mongoose.Types.ObjectId;

  fecha: string;
  inicio: string;
  bloque: string;

  estado: "confirmada" | "cancelada";

  createdAt: Date;
  updatedAt: Date;
}

const ReservaSchema = new Schema<IReserva>(
  {
    cancha: {
      type: Schema.Types.ObjectId,
      ref: "Cancha",
      required: true,
    },

    numeroCancha: {
      type: Number,
      required: true,
    },

    nombreCancha: {
      type: String,
      required: true,
    },

    techada: {
      type: Boolean,
      required: true,
    },

    usuario: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fecha: {
      type: String,
      required: true,
    },

    inicio: {
      type: String,
      required: true,
    },

    bloque: {
      type: String,
      required: true,
    },

    estado: {
      type: String,
      enum: ["confirmada", "cancelada"],
      default: "confirmada",
    },
  },
  {
    timestamps: true,
  }
);

ReservaSchema.index(
  {
    cancha: 1,
    fecha: 1,
    bloque: 1,
    estado: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      estado: "confirmada",
    },
  }
);

export const Reserva = mongoose.model<IReserva>(
  "Reserva",
  ReservaSchema
);