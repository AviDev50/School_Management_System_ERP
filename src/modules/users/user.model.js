import db from "../../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

export async function createUser(data) {
  const { name, email, password, role, school_id } = data;

  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role, school_id)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, role, school_id]
  );

  return result.insertId;
}

export async function createSchool(data) {
  const { school_name, email, phone, address } = data;

  const [result] = await db.query(
    `INSERT INTO schools (school_name, email, phone, address)
     VALUES (?, ?, ?, ?)`,
    [school_name, email, phone, address]
  );

  return result.insertId;
}

export async function getSchoolById(id) {
  const [rows] = await db.query(
    "SELECT * FROM schools WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}
