import { dispatchNotification } from "./dispatcher";

const useSendNotification = () => {
  const send = async ({ eventType, user, params }) => {
    try {
      await dispatchNotification({
        type: eventType,
        user,
        params,
      });
    } catch (err) {
      console.error("Notification dispatch failed:", err);
    }
  };

  return { send };
};

export default useSendNotification;
