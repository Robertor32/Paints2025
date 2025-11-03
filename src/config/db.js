import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {
  DB_DIALECT = 'sqlite',
  DB_STORAGE = './data/paints.sqlite',
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS
} = process.env;

let sequelize;

if (DB_DIALECT === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_STORAGE,
    logging: false,
  });
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false,
    dialectOptions: DB_DIALECT === 'mssql' ? {
      options: { encrypt: process.env.DB_ENCRYPT === 'true' }
    } : {}
  });
}

export default sequelize;
