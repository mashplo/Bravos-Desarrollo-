import { User } from '../src/models/user.model.js';
import { sequelize } from '../src/config/database.js';

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // Verificar si ya existe un usuario admin
    const admin = await User.findOne({ where: { role: 'admin' } });
    if (admin) {
      console.log('Ya existe un usuario administrador:', admin.usuario);
      process.exit(0);
    }
    // Crear usuario admin
    const nuevoAdmin = await User.create({
      nombre_apellido: 'Trabajador Admin',
      correo: 'trabajador1@bravos.pe',
      usuario: 'trabajador1',
      password: 'Hamburguesa.',
      role: 'admin'
    });
    console.log('Usuario administrador creado:', nuevoAdmin.usuario);
    process.exit(0);
  } catch (err) {
    console.error('Error creando usuario admin:', err);
    process.exit(1);
  }
})();
