import db from "../../config/db.js";

export async function createSchool({ school_name, email, phone, address }) {
  const [result] = await db.query(
    "INSERT INTO schools (school_name, email, phone, address) VALUES (?,?,?,?)",
    [school_name, email, phone, address]
  );
  return result.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

export async function createUser({
  school_id = null,
  name,
  email,
  password,
  role,
}) {
  const [result] = await db.query(
    `INSERT INTO users (school_id, name, email, password, role)
     VALUES (?,?,?,?,?)`,
    [school_id, name, email, password, role]
  );

  return result.insertId;
}

export async function getActiveUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? AND status = 1",
    [email]
  );
  return rows[0] || null;
}

export async function getSchoolById(id) {
  const [rows] = await db.query(
    "select * from schools where id =?",
    [id]
  );
  return rows[0] || null
}
