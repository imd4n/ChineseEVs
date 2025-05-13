const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "08052006Dan",
    host: "localhost",
    port: 5432,
    database: "chinese_evs"
});

module.exports = pool;