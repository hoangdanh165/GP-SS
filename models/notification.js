// models/notification.js
import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    params: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    create_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    extra_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "notification",
    timestamps: false,
  }
);

export default Notification;
