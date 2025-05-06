import { getRecipientSocketId, io } from "../socket/socket.js";

async function sendUpdates(req, res) {
  try {
    const { formData } = req.body;
    console.log(formData);

    const receiver = formData.customer;

    const recipientSocketId = getRecipientSocketId(receiver);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newUpdatesOfAppoinment", formData);
      console.log("Updates's sent through WebSocket!");
    } else {
      console.log("Receiver not online!");
    }

    res.status(201).json({ message: "Updates sent!" });
  } catch (error) {
    console.error("Error(s) in sendUpdates:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { sendUpdates };
