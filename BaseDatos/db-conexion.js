const sql = require("mssql");

// Configura tu cadena de conexión
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
};

async function connect() {
  await sql.connect(config);
  return sql;
}

module.exports = connect;
