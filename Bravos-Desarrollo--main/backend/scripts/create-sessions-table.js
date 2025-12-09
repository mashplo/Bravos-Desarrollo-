import { sequelize } from "../src/config/database.js";
import { Session } from "../src/models/session.model.js";

async function createSessionsTable() {
  try {
    console.log("🔄 Creando tabla de sesiones...");
    
    await Session.sync({ force: false });
    
    console.log("✅ Tabla de sesiones creada exitosamente");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creando tabla de sesiones:", error);
    process.exit(1);
  }
}

createSessionsTable();
