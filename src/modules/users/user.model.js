import db from "../../config/db.js";



export const UserModel = {
  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  create: async ({ school_id, name, email, password, role }) => {
    const [result] = await db.query(
      `INSERT INTO users (school_id, name, email, password, role)
       VALUES (?,?,?,?,?)`,
      [school_id, name, email, password, role]
    );
    return result.insertId;
  },

  findActiveUserByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND status = 1",
      [email]
    );
    return rows[0];
  }
};
