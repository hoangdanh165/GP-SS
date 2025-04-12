import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";
import Category from "./category.js";

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    discount_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    discount_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimated_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "service",
    timestamps: false,
  }
);

Service.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "SET NULL",
  allowNull: true,
  as: "category",
});

export default Service;
