// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import db from "../../config/db.js";

export async function getUserByEmail(user_email) {
  const [rows] = await db.query(
    "SELECT user_id, user_email, password, role, school_id FROM users WHERE user_email = ?",
    [user_email]
  );
  return rows[0];
}
