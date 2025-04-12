import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import express from "express";
import cors from "cors";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
dotenv.config();
connectDB();

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
