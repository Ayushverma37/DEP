const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "manusukhda",
    host: "localhost",
    port: 5432,
    database: "research_mgmt"
});

module.exports = pool;

