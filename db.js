// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";
// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.POSTGRES_DB,
//   process.env.POSTGRES_USER,
//   process.env.POSTGRES_PASSWORD,
//   {
//     host: process.env.POSTGRES_HOST,
//     dialect: "postgres",
//     logging: false,
//     define: {
//       timestamps: false,
//     },
//   }
// );

// // Models import
// import User from "./models/user.js";
// import Role from "./models/role.js";
// import Appointment from "./models/appointment.js";
// import AppointmentService from "./models/appointmentservice.js";
// import Service from "./models/service.js";
// import Notification from "./models/notification.js";
// import NotificationUser from "./models/notificationUser.js";
// import Category from "./models/category.js";

// // Relationships
// User.hasMany(Appointment);
// Appointment.belongsTo(User);

// const initializeDb = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection to PostgreSQL has been established successfully.");

//     // await sequelize.sync({ force: false });
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// initializeDb();

// export {
//   sequelize,
//   User,
//   Appointment,
//   AppointmentService,
//   Service,
//   Category,
//   Role,
//   Notification,
//   NotificationUser,
// };
