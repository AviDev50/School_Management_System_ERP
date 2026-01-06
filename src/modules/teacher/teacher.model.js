// modules/teacher/teacher.model.js
import bcrypt from 'bcrypt';
import db from "../../config/db.js";

// Get teacher by ID
export async function getTeacherById(teacherId, schoolId, connection = null) {
  const conn = connection || await db.getConnection();

  try {
    const [teachers] = await conn.query(
      `SELECT 
        t.teacher_id, t.user_id, t.qualification, t.experience_years, t.joining_date,
        u.name, u.user_email
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.teacher_id = ? AND t.school_id = ?`,
      [teacherId, schoolId]
    );

    return teachers[0] || null;
  } finally {
    if (!connection) conn.release();
  }
}

export async function updateTeacher(teacher_id, school_id, data) {
  const connection = await db.getConnection();

  try {
    const fields = [];  
    const values = [];  

    if (data.qualification !== undefined) {
      fields.push("qualification = ?");
      values.push(data.qualification);
    }

    if (data.experience_years !== undefined) {
      fields.push("experience_years = ?");
      values.push(data.experience_years);
    }

    if (fields.length === 0) return 0;

    const sql = `UPDATE teachers SET ${fields.join(", ")} WHERE teacher_id = ? AND school_id = ?`;
    values.push(teacher_id, school_id);

    const [rows] = await connection.query(
      `SELECT 
        t.teacher_id,
        t.user_id,
        t.qualification,
        t.experience_years,
        u.name,
        u.user_email
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.teacher_id = ? AND t.school_id = ?`,
      [teacher_id, school_id]
    );

    return rows[0]; 

  } finally {
    connection.release();
  }
}
