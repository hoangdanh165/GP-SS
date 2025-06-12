import { getRecipientSocketId, io } from "../socket/socket.js";
import pool from "../db/connectDB.js";

async function sendMessage(req, res) {
  try {
    const { receiver, message, sender, image_path, image_url } = req.body;

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

    if (!conversationId) {
      console.log("No previous conversation found, creating...");
      const newConversation = await pool.query(
        `INSERT INTO conversation DEFAULT VALUES RETURNING id`
      );
      conversationId = newConversation.rows[0].id;
      console.log("Conversation ID mới:", conversationId);

      await pool.query(
        `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [conversationId, sender, receiver]
      );
    }

    const newMessage = await pool.query(
      `INSERT INTO message (id, conversation_id, sender_id, receiver_id, message, image,message_type, seen, created_at, updated_at, parent_message_id)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'text', FALSE, NOW(), NOW(), NULL) 
      RETURNING id, conversation_id AS conversation, sender_id AS sender, receiver_id AS receiver, 
                message, message_type, seen, created_at, updated_at, parent_message_id, image`,
      [conversationId, sender, receiver, message || null, image_path || null]
    );

    const messageData = newMessage.rows[0];

    if (messageData.image) {
      messageData.image = image_url;
    }

    await pool.query(
      `UPDATE conversation SET last_message = $1, last_sender_id = $2, updated_at = NOW() WHERE id = $3`,
      [message, sender, conversationId]
    );

    const recipientSocketId = getRecipientSocketId(receiver);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", messageData);
      console.log("Message's sent through WebSocket!");
    } else {
      console.log("Receiver not online!");
    }

    res.status(201).json(messageData);
  } catch (error) {
    console.error("Error(s) in sendMessage:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage };
