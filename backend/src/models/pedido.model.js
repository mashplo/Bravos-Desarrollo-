import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "IDPedido",
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "Fecha_Hora",
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Estado",
    },
    monto_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "Monto_Total",
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Metodo_Pago",
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "IDCliente",
    },
  },
  {
    tableName: "pedidos",
    timestamps: false,
  }
);
