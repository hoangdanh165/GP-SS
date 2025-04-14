import cron from "node-cron";
import { getUpcomingAppointments } from "../services/appointmentService.js";
import { dispatchNotification } from "../notifications/dispatcher.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"; // Import plugin UTC
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

const startReminderJob = () => {
  cron.schedule("*/5 * * * * *", async () => {
    console.log("[CRON] Running reminder job...");

    const appointments = await getUpcomingAppointments();

    for (const appointment of appointments) {
      const { id, customer, date, reminded_before_1h, reminded_before_1d } =
        appointment;

      const apptTime = dayjs.tz(date, VN_TIMEZONE);
      const now = dayjs().tz(VN_TIMEZONE);

      const diffInMinutes = apptTime.diff(now, "minute");
      console.log(
        `[CRON] Processing appointment ID: ${id}, diff: ${diffInMinutes} minutes`
      );

      if (diffInMinutes >= 58 && diffInMinutes <= 60 && !reminded_before_1h) {
        // await dispatchNotification({
        //   type: "WEB",
        //   reminderType: "APPOINTMENT_REMINDER_1H",
        //   user: customer,
        //   params: { time: apptTime.format("HH:mm DD/MM/YYYY") },
        // });
        await dispatchNotification({
          type: "EMAIL",
          reminderType: "APPOINTMENT_REMINDER_1H",
          id: id,
        });
        console.log("sent reminder 1h email");
      }

      if (
        diffInMinutes >= 1438 &&
        diffInMinutes <= 1440 &&
        !reminded_before_1d
      ) {
        await dispatchNotification({
          type: "EMAIL",
          reminderType: "APPOINTMENT_REMINDER_1D",
          user: customer,
          params: { time: apptTime.format("HH:mm DD/MM/YYYY") },
        });
        await dispatchNotification({
          type: "EMAIL",
          id: id,
          reminderType: "APPOINTMENT_REMINDER_1D",
        });
      }
    }
  });
};

export default startReminderJob;
