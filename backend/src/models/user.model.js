import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "IDUser",
    },
    nombre_apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Nombre_Apellido",
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "Correo",
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "Usuario",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Password",
    },
    ubicacion_domicilio: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Ubicacion_Domicilio",
    },
    numero_telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Numero_Telefono",
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "Edad",
    },
    role: {
      type: DataTypes.ENUM("cliente", "admin"),
      allowNull: false,
      defaultValue: "cliente",
      field: "Role",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

