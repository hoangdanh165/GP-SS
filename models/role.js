import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "role",
    timestamps: false,
  }
);

export default Role;
