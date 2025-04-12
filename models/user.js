import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";
import Role from "./role.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    google_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "role",
        key: "id",
      },
      allowNull: true,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // ACTIVE
      validate: {
        isIn: [[0, 1]], // 0 = BANNED, 1 = ACTIVE
      },
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_staff: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_superuser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

export default User;
