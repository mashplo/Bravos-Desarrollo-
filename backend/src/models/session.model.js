import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Session = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "device_id",
    },
    device_type: {
      type: DataTypes.ENUM("web", "mobile"),
      allowNull: false,
      field: "device_type",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "token",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    last_activity: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "last_activity",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "sessions",
    timestamps: false,
  }
);
