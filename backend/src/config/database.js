import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// If DB env vars are provided, use MySQL. Otherwise fall back to a local SQLite file
// to make local development easier (no MySQL required).
const hasDbEnv = process.env.DB_NAME && process.env.DB_USER && process.env.DB_HOST;

let sequelize;
if (hasDbEnv) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false
    }
  );
} else {
  // Use a sqlite file stored in backend/data/dev.sqlite so it's persisted between runs.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const storagePath = path.join(__dirname, '..', '..', 'data', 'dev.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });
}

export { sequelize };