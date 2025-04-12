import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";
import User from "./user.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    additional_customer_information: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    vehicle_information: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    vehicle_ready_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pickup_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    update_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "appointment",
    timestamps: false,
  }
);

Appointment.belongsTo(User, { foreignKey: "customer_id", as: "customer" });

export default Appointment;
