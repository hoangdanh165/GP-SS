import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";
import Appointment from "./appointment.js";
import Service from "./service.js";

const AppointmentService = sequelize.define(
  "AppointmentService",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "appointment_service",
    timestamps: false,
  }
);

AppointmentService.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});
AppointmentService.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

export default AppointmentService;
