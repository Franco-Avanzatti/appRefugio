import "dotenv/config";
import { connectDB } from "../config/db";
import { Cancha } from "../models/Cancha";

const seed = async () => {
  await connectDB();

  await Cancha.deleteMany({});

  await Cancha.insertMany([
    {
      nombre: "Cancha 1",
      numero: 1,
      techada: true,
      activa: true,
    },
    {
      nombre: "Cancha 2",
      numero: 2,
      techada: true,
      activa: true,
    },
    {
      nombre: "Cancha 3",
      numero: 3,
      techada: true,
      activa: true,
    },
    {
      nombre: "Cancha 4",
      numero: 4,
      techada: false,
      activa: true,
    },
  ]);

  console.log("✅ Canchas creadas");
  process.exit(0);
};

seed();
