import db from "../../config/db.js";

// export async function findSuperAdminByEmail(email) {
//   const [rows] = await db.query(
//     "SELECT * FROM super_admin WHERE email = ?",
//     [email]
//   );
//   return rows[0] || null;
// }

// export async function createSuperAdmin(data) {
//   const { name, email, password } = data;

//   const [result] = await db.query(
//     `INSERT INTO super_admin (name, email, password)
//      VALUES (?, ?, ?)`,
//     [name, email, password]
//   );

//   return result.insertId;
// }

export async function createSchool(conn,school_name,email,phone,address) {
  const [result] = await conn.query(
    "INSERT INTO schools (school_name,email,phone,address) VALUES (?, ?, ?, ?)",
    [school_name,email,phone,address]
  );
  return result.insertId;
}

export async function getUserByEmail(conn, user_email) {
  const [rows] = await conn.query(
    "SELECT user_id FROM users WHERE user_email = ?",
    [user_email]
  );
  return rows[0];
}

export async function createUser(conn, data) {
  const {schoolId,name, user_email, password} = data;

  const [result] = await conn.query(
    `INSERT INTO users (name, user_email, password,school_id)
     VALUES (?, ?, ?, ?)`,
    [name, user_email, password,schoolId]
  );

  return result.insertId;
}

export async function createSchoolAdmin(conn, userId, schoolId) {
  await conn.query(
    `INSERT INTO school_admins (user_id, school_id)
     VALUES (?, ?)`,
    [userId, schoolId]
  );
}
