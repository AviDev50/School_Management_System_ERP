// modules/accountant/accountant.model.js
import db from "../../config/db.js";

// Get accountant by ID here we access id 
export async function getAccountantById(accountantId, schoolId, connection = null) {
  const conn = connection || await db.getConnection();

  try {
    const [accountants] = await conn.query(
      `SELECT 
        a.accountant_id, a.user_id, a.qualification,
        u.name, u.user_user_email
      FROM accountants a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.accountant_id = ? AND a.school_id = ?`,
      [accountantId, schoolId]
    );

    return accountants[0] || null;
  } finally {
    if (!connection) conn.release();
  }
}

// Checking here user_user_email exists excluding user
export async function checkuser_user_emailExistsExcludingUser(user_email, schoolId, excludeUserId, connection = null) {
  const conn = connection || await db.getConnection();

  try {
    const [users] = await conn.query(
      'SELECT user_id FROM users WHERE user_email = ? AND school_id = ? AND user_id != ?',
      [user_email, schoolId, excludeUserId]
    );
    return users.length > 0;
  } finally {
    if (!connection) conn.release();
  }
}

export async function updateStudent(student_id, data, school_id) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(student_id, school_id);

  const sql = `
    UPDATE students
    SET ${fields.join(", ")}
    WHERE student_id = ? AND school_id = ?
  `;

  const [result] = await db.query(sql, values);
  return result;
}

export async function updateTeacher(teacher_id, data, school_id) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(teacher_id, school_id);

  const sql = `
    UPDATE teachers
    SET ${fields.join(", ")}
    WHERE teacher_id = ? AND school_id = ?
  `;

  const [result] = await db.query(sql, values);
  return result;
}

export async function updateAccountant(accountant_id, data, school_id) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(accountant_id, school_id);

  const sql = `
    UPDATE accountants
    SET ${fields.join(", ")}
    WHERE accountant_id = ? AND school_id = ?
  `;

  const [result] = await db.query(sql, values);
  return result;
}

