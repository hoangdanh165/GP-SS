import db from "../models";
import dayjs from "dayjs";

export const getUpcomingAppointments = async () => {
  const now = dayjs();
  const in24Hours = now.add(24, "hour");

  const appointments = await db.Appointment.findAll({
    where: {
      schedule_time: {
        [Op.between]: [now.toDate(), in24Hours.toDate()],
      },
      status: "confirmed",
    },
    include: ["customer"],
  });

  return appointments;
};
