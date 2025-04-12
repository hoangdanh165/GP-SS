import cron from "node-cron";
import { getUpcomingAppointments } from "../services/appointmentService";
import { dispatchNotification } from "../notifications/dispatcher";
import dayjs from "dayjs";

// Chạy mỗi phút
const startReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("[CRON] Running reminder job...");

    const appointments = await getUpcomingAppointments();

    for (const appointment of appointments) {
      const { customer, schedule_time, id } = appointment;
      const now = dayjs();
      const apptTime = dayjs(schedule_time);
      const diffInMinutes = apptTime.diff(now, "minute");

      // Gửi nhắc 1 tiếng trước
      if (diffInMinutes === 60) {
        await dispatchNotification({
          type: "APPOINTMENT_REMINDER_1H",
          user: customer,
          params: { time: apptTime.format("HH:mm DD/MM/YYYY") },
        });
      }

      // Gửi nhắc 1 ngày trước
      if (diffInMinutes === 1440) {
        await dispatchNotification({
          type: "APPOINTMENT_REMINDER_1D",
          user: customer,
          params: { time: apptTime.format("HH:mm DD/MM/YYYY") },
        });
      }
    }
  });
};

export default startReminderJob;
