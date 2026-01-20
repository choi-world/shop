import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { Schema } from '.';
require('dotenv').config();

console.log(
  `[DB] Connecting to MySQL on ${process.env.ENVIRONMENT == 'production' ? process.env.PRD_DB_HOST : process.env.DEV_DB_HOST} ${process.env.ENVIRONMENT == 'production' ? process.env.PRD_DB_PORT : process.env.DEV_DB_PORT} (db=${process.env.ENVIRONMENT == 'production' ? process.env.PRD_DB_NAME : process.env.DEV_DB_NAME})`,
);

export const db = new Kysely<Schema>({
  dialect: new MysqlDialect({
    pool: createPool({
      host: process.env.ENVIRONMENT == 'production' ? process.env.PRD_DB_HOST : process.env.DEV_DB_HOST,
      user: process.env.ENVIRONMENT == 'production' ? process.env.PRD_DB_USER : process.env.DEV_DB_USER,
      password: process.env.ENVIRONMENT == 'production' ? process.env.PRD_DB_PASSWORD : process.env.DEV_DB_PASSWORD,
      database: process.env.ENVIRONMENT == 'production' ? process.env.PRD_DB_NAME : process.env.DEV_DB_NAME,
      port: process.env.ENVIRONMENT == 'production' ? Number(process.env.PRD_DB_PORT) : Number(process.env.DEV_DB_PORT),
    }),
  }),
});
