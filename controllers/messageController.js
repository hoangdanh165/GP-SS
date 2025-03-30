import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import pool from "../db/connectDB.js";

async function sendMessage(req, res) {
  try {
    const { receiver, message, sender } = req.body;
    console.log("📩 Data nhận từ client:", { receiver, message });

    console.log("👤 Người gửi:", sender);

    let conversation = await pool.query(
      `SELECT id FROM conversation
      WHERE EXISTS (
        SELECT 1 FROM conversation_participants 
        WHERE conversation_id = conversation.id 
        AND user_id = $1
      ) 
      AND EXISTS (
        SELECT 1 FROM conversation_participants 
        WHERE conversation_id = conversation.id 
        AND user_id = $2
      )`,
      [sender, receiver]
    );

    let conversationId = conversation.rows[0]?.id;
    console.log("💬 Conversation ID:", conversationId);

    // Nếu không có thì tạo mới
    if (!conversationId) {
      console.log("🚀 Không tìm thấy cuộc trò chuyện, tạo mới...");
      const newConversation = await pool.query(
        `INSERT INTO conversation DEFAULT VALUES RETURNING id`
      );
      conversationId = newConversation.rows[0].id;
      console.log("🆕 Conversation ID mới:", conversationId);

      await pool.query(
        `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [conversationId, sender, receiver]
      );
    }

    // Thêm tin nhắn vào DB
    const newMessage = await pool.query(
      `INSERT INTO message (id, conversation_id, sender_id, receiver_id, message, message_type, status, created_at, updated_at, parent_message_id)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'text', 'sent', NOW(), NOW(), NULL) 
      RETURNING id, conversation_id AS conversation, sender_id AS sender, receiver_id AS receiver, 
                message, message_type, status, created_at, updated_at, parent_message_id`,
      [conversationId, sender, receiver, message || null]
    );
    console.log("📨 Tin nhắn mới:", newMessage.rows[0]);

    // Cập nhật lastMessage trong conversation
    await pool.query(
      `UPDATE conversation SET last_message = $1, last_sender_id = $2, updated_at = NOW() WHERE id = $3`,
      [message, sender, conversationId]
    );

    // Kiểm tra người nhận có online không
    const recipientSocketId = getRecipientSocketId(receiver);
    console.log("📡 Socket ID của người nhận:", recipientSocketId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage.rows[0]);
      console.log("📬 Tin nhắn đã gửi qua WebSocket!");
    } else {
      console.log("⚠️ Người nhận không online!");
    }

    res.status(201).json(newMessage.rows[0]);
  } catch (error) {
    console.error("❌ Lỗi trong sendMessage:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage };
