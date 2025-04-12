import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";
import Notification from "./notification.js";

const NotificationUser = sequelize.define(
  "NotificationUser",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "notification_user",
    timestamps: false,
  }
);

NotificationUser.belongsTo(Notification, {
  foreignKey: "notification_id",
});

export default NotificationUser;
