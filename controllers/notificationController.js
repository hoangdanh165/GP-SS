import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { sendWebNotification } from "../notifications/channels/web.js";

dayjs.extend(utc);
dayjs.extend(timezone);

async function createNotification(req, res) {
  try {
    const {
      user_id,
      roles,
      type,
      reminder_type,
      params = null,
      create_url = null,
      extra_data = null,
    } = req.body;

    console.log(req.body);

    const hasTarget = user_id || roles;

    if (!hasTarget) {
      return res.status(400).json({
        error: "Target (roles or user_id) is required!",
      });
    }
    let notificationData;

    if (type === "WEB") {
      notificationData = await sendWebNotification(
        user_id,
        roles,
        reminder_type,
        params,
        create_url,
        extra_data
      );
    }

    res.status(201).json(notificationData);
  } catch (error) {
    console.error("Error when creating notification:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { createNotification };
