import { User } from '../src/models/user.model.js';
import { sequelize } from '../src/config/database.js';

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const users = await User.findAll({ limit: 50 });
    console.log('Usuarios encontrados:', users.length);
    users.forEach(u => {
      console.log({ id: u.id, correo: u.correo, usuario: u.usuario, nombre: u.nombre_apellido });
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listando usuarios:', err);
    process.exit(1);
  }
})();
