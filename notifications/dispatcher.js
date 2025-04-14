import webTemplates from "./templates/web.js";

import { sendWebNotification } from "./channels/web.js";
import { sendEmailNotification } from "./channels/email.js";

export const dispatchNotification = async ({
  type,
  reminderType = null,
  id = null,
  user = null,
  params = {},
}) => {
  if (!type && !reminderType) return;

  if (type === "EMAIL") {
    console.log("Sending email notification...");
    if (!id || !reminderType) return;
    const msg = await sendEmailNotification({ id, reminderType, type });
    return msg;
  }

  if (type === "WEB") {
    if (!user) return;
    console.log("Sending web notification...");
    if (webTemplates[reminderType]) {
      const msg = webTemplates[type](params);
      sendWebNotification(user.id, msg);
    }
  }
};
