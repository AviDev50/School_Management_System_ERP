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

export async function updateAccountant(accountant_id, school_id, data) {
  const connection = await db.getConnection();

  try {
    const fields = [];
    const values = [];

    if (data.qualification !== undefined) {
      fields.push("qualification = ?");
      values.push(data.qualification);
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE accountants SET ${fields.join(", ")} WHERE accountant_id = ? AND school_id = ?`;
    values.push(accountant_id, school_id);

    const [result] = await connection.query(sql, values);
    
    if (result.affectedRows === 0) {
      return null;
    }

    // Updated record fetch karo with user details
    const [rows] = await connection.query(
      `SELECT 
        a.*,
        u.name,
        u.user_email
      FROM accountants a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.accountant_id = ? AND a.school_id = ?`,
      [accountant_id, school_id]
    );

    return rows[0];

  } finally {
    connection.release();
  }
}