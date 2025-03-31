import { Server } from "socket.io";
import http from "http";
import express from "express";
import pool from "../db/connectDB.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // ["http://localhost:3000", "https://prestige-auto.netlify.app"]
  cors: {
    origin: "*",
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // userId: socketId

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await pool.query(
        `UPDATE message 
      SET seen = TRUE
      WHERE conversation_id = $1 AND seen = FALSE`,
        [conversationId]
      );

      await pool.query(
        `UPDATE conversation 
      SET last_message_seen = TRUE
      WHERE id = $1`,
        [conversationId]
      );

      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
