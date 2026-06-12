import { Document, Schema, model } from "mongoose";

export interface ICancha extends Document {
  nombre: string;
  descripcion?: string;
  numero: number;
  activa: boolean;
  techada: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CanchaSchema = new Schema<ICancha>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      default: "",
    },

    numero: {
      type: Number,
      required: true,
      unique: true,
    },

    activa: {
      type: Boolean,
      default: true,
    },

    techada: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Cancha = model<ICancha>("Cancha", CanchaSchema);