import Notification from "../models/notification.js";
import NotificationUser from "../models/notificationUser.js";
import User from "../models/user.js";
import Role from "../models/role.js";
import sequelize from "../db/sequelize.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

async function createNotification(req, res) {
  const t = await sequelize.transaction();
  try {
    const {
      user_id,
      roles,
      message,
      params = null,
      create_url = null,
      extra_data = null,
    } = req.body;

    console.log(req.body);
    const hasTarget = user_id || roles;

    if (!hasTarget || !message) {
      return res.status(400).json({
        error: "Target (roles or user_id) and message are required!",
      });
    }

    const notification = await Notification.create(
      {
        message,
        params,
        create_url,
        extra_data,
      },
      { transaction: t }
    );

    const notificationId = notification.id;

    const createAt = dayjs()
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ssZ");

    let notificationUser;

    if (roles) {
      notificationUser = await NotificationUser.create(
        {
          notification_id: notificationId,
          user_id: null,
          roles: roles,
          is_read: false,
          create_at: createAt,
        },
        { transaction: t }
      );
      console.log(`Created notification for roles ${roles}:`, notificationUser);
    } else {
      notificationUser = await NotificationUser.create(
        {
          notification_id: notificationId,
          user_id: user_id,
          is_read: false,
          create_at: createAt,
        },
        { transaction: t }
      );
    }

    const notificationData = {
      id: notificationUser?.id || null,
      notification: {
        id: notificationId,
        message,
        params,
        create_url,
        extra_data,
      },
      user: user_id || null,
      is_read: false,
      create_at: createAt,
      roles: roles || null,
    };

    console.log("Notification data:", notificationData);
    if (user_id) {
      const recipientSocketId = getRecipientSocketId(user_id);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newNotification", notificationData);
        console.log(
          `Sent new notification to user ${user_id}:`,
          notificationData
        );
      } else {
        console.log(`User ${user_id} not online, notification saved only.`);
      }
    }

    if (roles) {
      const roleArray = roles.split(",").map((r) => r.trim());

      const users = await User.findAll({
        include: [
          {
            model: Role,
            as: "role",
            where: {
              name: roleArray,
            },
            attributes: [],
          },
        ],
        attributes: ["id"],
      });

      if (!users.length) {
        await t.rollback();
        return res.status(404).json({ error: "No users found for this role" });
      }

      users.forEach((user) => {
        const recipientSocketId = getRecipientSocketId(user.id);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newNotification", notificationData);
          console.log(
            `Sent new notification to user ${user.id}:`,
            notificationData
          );
        } else {
          console.log(`User ${user.id} not online, notification saved only.`);
        }
      });
    }

    res.status(201).json(notificationData);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error("Error when creating notification:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { createNotification };
