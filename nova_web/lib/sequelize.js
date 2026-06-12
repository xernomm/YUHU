import { Sequelize } from 'sequelize';

// In Next.js development mode, hot-reloading resets the module cache,
// which can create duplicate connections to the database.
// Caching the Sequelize instance on the global object prevents this.

const databaseUrl = process.env.DATABASE_URL;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

if (!databaseUrl && (!dbName || !dbUser || !dbPassword || !dbHost || !dbPort)) {
  throw new Error('Database environment variables or DATABASE_URL are missing.');
}

const isProduction = process.env.NODE_ENV === 'production';
const dialect = databaseUrl ? (databaseUrl.startsWith('postgres') ? 'postgres' : 'mysql') : 'mysql';

const commonConfig = {
  dialect,
  logging: isProduction ? false : console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// Add SSL configuration for PostgreSQL connections (e.g. Neon)
if (dialect === 'postgres') {
  commonConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

let sequelize;

if (isProduction) {
  if (databaseUrl) {
    sequelize = new Sequelize(databaseUrl, commonConfig);
  } else {
    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      ...commonConfig,
    });
  }
} else {
  if (!global.sequelizeInstance) {
    if (databaseUrl) {
      global.sequelizeInstance = new Sequelize(databaseUrl, commonConfig);
    } else {
      global.sequelizeInstance = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        port: dbPort,
        ...commonConfig,
      });
    }
  }
  sequelize = global.sequelizeInstance;
}

export default sequelize;
