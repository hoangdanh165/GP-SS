import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import dayjs from "dayjs";

export const getUpcomingAppointments = async () => {
  const now = dayjs();
  const in24Hours = now.add(24, "hour");

  const appointments = await Appointment.findAll({
    where: {
      date: {
        [Op.between]: [now.toDate(), in24Hours.toDate()],
      },
      status: "confirmed",
      [Op.or]: [{ reminded_before_1h: false }, { reminded_before_1d: false }],
    },
    include: [{ model: User, as: "customer" }],
  });

  return appointments;
};
