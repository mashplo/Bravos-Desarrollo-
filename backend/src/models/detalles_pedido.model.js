import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const DetallePedido = sequelize.define(
  "DetallePedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "IDDetalle",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "Cantidad",
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "Precio",
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "IDPedido",
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "IDProducto",
    },
  },
  {
    tableName: "detalles_pedido",
    timestamps: false,
  }
);
