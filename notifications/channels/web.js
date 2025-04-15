import { getRecipientSocketId, io } from "../../socket/socket.js";
import Notification from "../../models/notification.js";
import NotificationUser from "../../models/notificationUser.js";
import Role from "../../models/role.js";
import User from "../../models/user.js";
import sequelize from "../../db/sequelize.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import webTemplates from "../templates/web.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const sendWebNotification = async (
  user_id = null,
  roles = null,
  reminder_type,
  params = null,
  create_url = null,
  extra_data = null
) => {
  const t = await sequelize.transaction();
  try {
    console.log(user_id, roles, reminder_type, params, create_url, extra_data);
    let formattedTime = params.time;

    if (!formattedTime) {
      throw new Error(`Missing or invalid time in params for reminder`);
    }

    formattedTime = dayjs(formattedTime)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm");

    const templateResult = webTemplates[reminder_type]({ time: formattedTime });
    const message = templateResult.message;

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

    await t.commit();
    return notificationData;
  } catch (error) {
    await t.rollback();
    console.error("Error when creating notification:", error.message);
    throw error;
  }
};
