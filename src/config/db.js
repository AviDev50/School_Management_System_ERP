import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootmish@2025",
  database: "school_erp"
});

export default db;
