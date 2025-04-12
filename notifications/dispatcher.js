import webTemplates from "./templates/web";
import emailTemplates from "./templates/email";
import smsTemplates from "./templates/sms";

import { sendWebNotification } from "./channels/web";
import { sendEmailNotification } from "./channels/email";
import { sendSMSNotification } from "./channels/sms";

export const dispatchNotification = async ({ type, user, params = {} }) => {
  if (!type || !user) return;

  // Web
  if (webTemplates[type]) {
    const msg = webTemplates[type](params);
    sendWebNotification(user.id, msg);
  }

  // Email
  if (emailTemplates[type]) {
    const email = emailTemplates[type]({ ...params, name: user.name });
    await sendEmailNotification(user, email);
  }

  // SMS
  if (smsTemplates[type]) {
    const sms = smsTemplates[type](params);
    await sendSMSNotification(user, sms);
  }
};
