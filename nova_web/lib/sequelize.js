import { Sequelize } from 'sequelize';

// In Next.js development mode, hot-reloading resets the module cache,
// which can create duplicate connections to the database.
// Caching the Sequelize instance on the global object prevents this.

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

if (!dbName || !dbUser || !dbPassword || !dbHost || !dbPort) {
  throw new Error('Database environment variables are missing.');
}

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  if (!global.sequelizeInstance) {
    global.sequelizeInstance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }
  sequelize = global.sequelizeInstance;
}

export default sequelize;
