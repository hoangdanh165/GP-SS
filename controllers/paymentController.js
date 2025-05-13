import { getRecipientSocketId, io } from "../socket/socket.js";
import User from "../models/user.js";

async function sendUpdates(req, res) {
  try {
    const { formData } = req.body;
    console.log(formData);

    const adminsAndStaffs = await User.findAll({
      where: {
        role_id: [1, 2],
      },
      attributes: ["id"],
    });

    const adminAndStaffIds = adminsAndStaffs.map((user) => user.id);

    adminAndStaffIds.forEach((userId) => {
      const recipientSocketId = getRecipientSocketId(userId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newUpdatesOfPayment", formData);
        console.log(`Sent update to user ${userId}`);
      } else {
        console.log(`User ${userId} not online`);
      }
    });

    res.status(201).json({ message: "Updates sent!" });
  } catch (error) {
    console.error("Error in sendUpdates:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { sendUpdates };
