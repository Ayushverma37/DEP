const Pool = require("pg").Pool;

require("dotenv").config();

const devconfig={
    user: process.env.PG_USER,
    password: "password",
    host: "localhost",
    port: 5432,
    database: "research_mgmt"
}

const proConfig={
    connectionString: process.env.DATABASE_URL,
    ssl: true
}

const pool = new Pool({
    connectionString:"postgres://hjzkfaxfmpyjjo:6cf4a3fc572c16c2360d1536115d1d52abbfd38e7ca7b586b36a3a86330e4d67@ec2-52-54-212-232.compute-1.amazonaws.com:5432/d756afv3qeuka0",
    ssl: {
        rejectUnauthorized: false,
    },
} );

module.exports = pool;
