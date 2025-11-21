import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "arushi",
  host: "localhost",
  port: 5432,
  database: "odoo_spit"
});

export default pool;
