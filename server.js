import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
import messageRoutes from "./routes/messageRoutes.js";
import express from "express";
import cors from "cors";

app.use(
  cors({
    origin: "*", // Cho phép tất cả origin gọi API
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
