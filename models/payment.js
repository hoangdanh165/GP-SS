const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    invoice_id: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: true,
    },

    appointment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    method: {
      type: DataTypes.ENUM(
        "cash",
        "bank_transfer",
        "momo",
        "zalo_pay",
        "other"
      ),
      defaultValue: "cash",
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded", "canceled"),
      defaultValue: "pending",
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    qr_code_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    update_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payment",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Payment;
