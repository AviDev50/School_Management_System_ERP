import db from "../../config/db.js";

// export async function getStudentById(student_id) {
//   const connection = await db.getConnection();

//   try {
//     const [rows] = await connection.query(
//       "SELECT * FROM students WHERE student_id = ?",
//       [student_id]
//     );

//     return rows;
//   } catch (error) {
//     console.error("Error getting student details:", error);
//     throw error;
//   } finally {
//     connection.release(); 
//   }
// }

// modules/student/student.model.js

// Get student by ID
export async function getStudentById(studentId, schoolId, connection = null) {
  const conn = connection || await db.getConnection();

  try {
    const [students] = await conn.query(
      `SELECT
        s.student_id, s.user_id, s.admission_no, s.gender, 
        s.class_id, s.section_id,
        u.name, u.user_email
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.student_id = ? AND s.school_id = ?`,
      [studentId, schoolId]
    );

    return students[0] || null;
  } finally {
    if (!connection) conn.release();
  }
}

// Checking here user_email exists excluding user
export async function checkuser_emailExistsExcludingUser(user_email, schoolId, excludeUserId, connection = null) {
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

// Checking here admission number exists excluding student
export async function checkAdmissionNoExistsExcludingStudent(admissionNo, schoolId, excludeStudentId, connection = null) {
  const conn = connection || await db.getConnection();

  try {
    const [students] = await conn.query(
      'SELECT student_id FROM students WHERE admission_no = ? AND school_id = ? AND student_id != ?',
      [admissionNo, schoolId, excludeStudentId]
    );
    return students.length > 0;
  } finally {
    if (!connection) conn.release();
  }
}


export async function updateStudent(student_id, school_id, data) {
  const connection = await db.getConnection();

  try {
    const fields = [];
    const values = [];

    if (data.gender !== undefined) {
      fields.push("gender = ?");
      values.push(data.gender);
    }

    if (data.class_id !== undefined) {
      fields.push("class_id = ?");
      values.push(data.class_id);
    }

    if (data.section_id !== undefined) {
      fields.push("section_id = ?");
      values.push(data.section_id);
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE students SET ${fields.join(", ")} WHERE student_id = ? AND school_id = ?`;
    values.push(student_id, school_id);

    const [result] = await connection.query(sql, values);
    
    if (result.affectedRows === 0) {
      return null;
    }

    const [rows] = await connection.query(
      `SELECT 
        s.*,
        u.name,
        u.user_email,
        c.class_name,
        sec.section_name
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      JOIN classes c ON s.class_id = c.class_id
      JOIN sections sec ON s.section_id = sec.section_id
      WHERE s.student_id = ? AND s.school_id = ?`,
      [student_id, school_id]
    );

    return rows[0];

  } finally {
    connection.release();
  }
}