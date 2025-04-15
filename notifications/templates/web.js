export default {
  APPOINTMENT_CONFIRMED: ({ time }) => ({
    message: `Your appointment has been confirmed. See you at ${time}.`,
  }),

  APPOINTMENT_CREATED_CUSTOMER: ({ time }) => ({
    message: `You have successfully booked an appointment at ${time}.`,
  }),

  APPOINTMENT_CREATED_STAFF: ({ customerName, time }) => ({
    message: `${customerName} just booked an appointment at ${time}.`,
  }),

  APPOINTMENT_CANCELLED: ({ time }) => ({
    message: `Your appointment on ${time} has been cancelled. Please contact the garage for more information.`,
  }),

  APPOINTMENT_UPDATED: ({ time }) => ({
    message: `Your appointment on ${time} has been updated. Please check for details.`,
  }),

  VEHICLE_READY: ({ time }) => ({
    message: `Your vehicle is ready at ${time}. You can come to pick it up during working hours.`,
  }),

  APPOINTMENT_REMINDER_B1H: ({ time }) => ({
    message: `You have an appointment in 1 hour at ${time}. Please be ready!`,
  }),

  APPOINTMENT_REMINDER_B1D: ({ time }) => ({
    message: `You have an appointment tomorrow at ${time}. Please be on time!`,
  }),

  FEEDBACK_REQUEST: () => ({
    message: `Are you satisfied with the service? Leave us a review!`,
  }),

  SERVICE_NOTE_UPDATED: ({ content }) => ({
    message: `Your appointment has been updated with the following note: ${content}`,
  }),
};
