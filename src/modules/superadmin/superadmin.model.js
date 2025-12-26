import db from "../../config/db.js";

export async function findSuperAdminByEmail(email) {
  const [rows] = await db.query(
    "SELECT * FROM super_admin WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

export async function createSuperAdmin({ name, email, password }) {
  const [result] = await db.query(
    "INSERT INTO super_admin (name, email, password) VALUES (?,?,?)",
    [name, email, password]
  );
  return result.insertId;
}
