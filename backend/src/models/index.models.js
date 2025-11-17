import { User } from "./user.model.js";
import { Producto } from "./producto.model.js";
import { Pedido } from "./pedido.model.js";
import { DetallePedido } from "./detalles_pedido.model.js";

// Un usuario realiza muchos pedidos
User.hasMany(Pedido, {
  foreignKey: "IDCliente",
});
Pedido.belongsTo(User, {
  foreignKey: "IDCliente",
});

// Un pedido contiene muchos detalles
Pedido.hasMany(DetallePedido, {
  foreignKey: "IDPedido",
});
DetallePedido.belongsTo(Pedido, {
  foreignKey: "IDPedido",
});

// Un producto aparece en muchos detalles
Producto.hasMany(DetallePedido, {
  foreignKey: "IDProducto",
});
DetallePedido.belongsTo(Producto, {
  foreignKey: "IDProducto",
});

export { User, Producto, Pedido, DetallePedido };
