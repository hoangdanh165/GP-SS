import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

export const sendEmailNotification = async ({ id, reminderType, type }) => {
  if (!id || !reminderType || !type) {
    console.error("Missing required parameters for sendEmailNotification:", {
      id,
      reminderType,
      type,
    });
    return;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/appointments/create-reminder/`,
      {
        id,
        type,
        reminder_type: reminderType,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to send email notification:",
      error.response?.data || error.message
    );
    throw error;
  }
};
