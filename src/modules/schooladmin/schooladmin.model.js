import db from "../../config/db.js";

export async function getUserByEmail(email) {
  const [rows] = await db.query("SELECT user_id FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function createUser({ name, email, password, role, school_id }) {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, school_id) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, role, school_id]
  );
  return result.insertId;
}
