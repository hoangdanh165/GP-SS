import { getRecipientSocketId, io } from "../socket/socket.js";
import User from "../models/user.js";

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

async function newAppointment(req, res) {
  try {
    const { formData } = req.body;
    console.log(formData);

    const targetUsers = await User.findAll({
      where: {
        role_id: [1, 2],
      },
      attributes: ["id"],
    });

    targetUsers.forEach((user) => {
      const recipientSocketId = getRecipientSocketId(user.id);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newAppoinment", formData);
        console.log(`Sent new appointment to user ${user.id}`);
      } else {
        console.log(`User ${user.id} not online`);
      }
    });

    res.status(201).json({ message: "Appointment sent!" });
  } catch (error) {
    console.error("Error(s) in sendAppointment:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { sendUpdates, newAppointment };
