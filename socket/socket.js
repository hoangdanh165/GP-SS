import { Server } from "socket.io";
import http from "http";
import express from "express";
import pool from "../db/connectDB.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
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
      // Cập nhật trạng thái "seen" cho tất cả tin nhắn chưa đọc trong cuộc trò chuyện
      await pool.query(
        `UPDATE message 
      SET status = 'seen' 
      WHERE conversation_id = $1 AND status != 'seen'`,
        [conversationId]
      );

      // Cập nhật trạng thái "seen" của lastMessage trong conversation
      await pool.query(
        `UPDATE conversation 
      SET last_message_seen = TRUE
      WHERE id = $1`,
        [conversationId]
      );

      // Gửi sự kiện về client
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
