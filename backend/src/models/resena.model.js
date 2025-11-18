import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Resena = sequelize.define(
  "Resena",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "IDResena",
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "IDUser",
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Nombre",
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "Comentario",
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Calificacion",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "Fecha",
    },
  },
  {
    tableName: "resenas",
    timestamps: false,
  }
);
