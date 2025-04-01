import { getRecipientSocketId, io } from "../socket/socket.js";
import pool from "../db/connectDB.js";

async function createConversation(req, res) {
  try {
    const { conversationStarter, conversationReceiver } = req.body;
    const participants = [conversationStarter, conversationReceiver];

    if (!participants || participants.length < 2) {
      return res
        .status(400)
        .json({ error: "Need at least 2 people to start a conversation" });
    }

    const newConversation = await pool.query(
      `INSERT INTO conversation (id, created_at, updated_at, last_message_seen) 
       VALUES (gen_random_uuid(), NOW(), NOW(), FALSE) 
       RETURNING id, created_at, updated_at`
    );

    const conversationId = newConversation.rows[0].id;

    const participantValues = participants
      .map((userId) => `('${conversationId}', '${userId}')`)
      .join(",");
    await pool.query(
      `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ${participantValues}`
    );

    const participantDetails = await pool.query(
      `SELECT u.id, u.full_name, 
          COALESCE(NULLIF(u.avatar, ''), u.avatar_url) AS avatar
      FROM "user" u 
      WHERE u.id = ANY($1)`,
      [participants]
    );

    const conversationData = {
      id: conversationId,
      participants: participantDetails.rows,
      last_message: null,
      last_sender: null,
      last_message_seen: false,
      created_at: newConversation.rows[0].created_at,
      updated_at: newConversation.rows[0].updated_at,
    };

    const recipientSocketId = getRecipientSocketId(conversationReceiver);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newConversation", conversationData);
      console.log(
        `Sent "newConversation" to user ${conversationReceiver} ${conversationData}!`
      );
    } else console.log("Receiver not online!");

    res.status(201).json(conversationData);
  } catch (error) {
    console.error("Error(s) when creating conversation:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { createConversation };
