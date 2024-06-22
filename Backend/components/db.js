const { Pool } = require('pg');
require('dotenv').config();

const devConfig = {
  user: process.env.DEV_PG_USER,
  password: process.env.DEV_PG_PASSWORD,
  host: process.env.DEV_PG_HOST,
  port: process.env.DEV_PG_PORT,
  database: process.env.DEV_PG_DATABASE,
};

const prodConfig = {
  connectionString: process.env.PROD_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig
);

module.exports = pool;
