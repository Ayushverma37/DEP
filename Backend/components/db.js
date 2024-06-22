const { Pool } = require('pg');
require('dotenv').config();

const {
  DEV_PG_USER,
  DEV_PG_PASSWORD,
  DEV_PG_HOST,
  DEV_PG_PORT,
  DEV_PG_DATABASE,
  PROD_PG_USER,
  PROD_PG_PASSWORD,
  PROD_PG_HOST,
  PROD_PG_PORT,
  PROD_PG_DATABASE,
  NODE_ENV,
} = process.env;

const devConfig = {
  user: DEV_PG_USER,
  password: DEV_PG_PASSWORD,
  host: DEV_PG_HOST,
  port: DEV_PG_PORT,
  database: DEV_PG_DATABASE,
};

const prodConfig = {
  user: PROD_PG_USER,
  password: PROD_PG_PASSWORD,
  host: PROD_PG_HOST,
  port: PROD_PG_PORT,
  database: PROD_PG_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
};
const pool = new Pool(NODE_ENV === 'production' ? prodConfig : devConfig);

module.exports = pool;
