import { io } from "../../socket/socket";

export const sendWebNotification = (userId, message) => {
  io.to(userId.toString()).emit("newNotification", {
    message,
    createdAt: new Date(),
  });
};
