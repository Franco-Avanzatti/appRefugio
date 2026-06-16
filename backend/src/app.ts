import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import authRoutes from "./routes/auth.routes";
import canchaRoutes from "./routes/cancha.routes";
import userRoutes from "./routes/user.routes";
import reservaRoutes from "./routes/reserva.routes";
import passport from "./config/passport";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
const httpServer = createServer(app);

// Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: ENV.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});


app.disable("x-powered-by");

// Middlewares
app.use(helmet());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: ENV.NODE_ENV });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/canchas", canchaRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

app.use(errorHandler);

// Sockets
io.on("connection", (socket) => {
  console.log(`🔌 Socket conectado: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`❌ Socket desconectado: ${socket.id}`);
  });
});

// Start
const start = async () => {
  await connectDB();
  httpServer.listen(ENV.PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${ENV.PORT}`);
  });
};

start();