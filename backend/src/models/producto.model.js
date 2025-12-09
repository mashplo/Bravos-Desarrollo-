import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "IDProducto",
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Nombre",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "Descripcion",
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "Precio",
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Categoria",
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Stock",
    },
  },
  {
    tableName: "productos",
    timestamps: false,
  }
);
