export default {
  APPOINTMENT_CONFIRMED: ({ time }) =>
    `Your appointment has been confirmed for ${time}.`,

  APPOINTMENT_CANCELLED: () => `Your appointment has been cancelled.`,

  VEHICLE_READY: ({ time }) => `Your vehicle is ready for pick-up at ${time}.`,

  APPOINTMENT_REMINDER_1H: ({ time }) =>
    `Reminder: your appointment is in 1 hour at ${time}.`,

  APPOINTMENT_REMINDER_1D: ({ time }) =>
    `Reminder: your appointment is tomorrow at ${time}.`,
};
