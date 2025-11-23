require('dotenv').config();

module.exports = {
  dev: {
    client: 'mysql2',
    connection: {
      host: process.env.DEV_DB_HOST,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      port: Number(process.env.DEV_DB_PORT),
      database: process.env.DEV_DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
  },

  prd: {
    client: 'mysql2',
    connection: {
      host: process.env.PRD_DB_HOST,
      user: process.env.PRD_DB_USER,
      password: process.env.PRD_DB_PASSWORD,
      port: Number(process.env.PRD_DB_PORT),
      database: process.env.PRD_DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
