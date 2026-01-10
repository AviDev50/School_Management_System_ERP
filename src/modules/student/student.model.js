import db from "../../config/db.js";

export async function getStudentById(student_id) {
  const [rows] = await db.query(
    `SELECT 
        s.student_id,
        s.school_id,
        s.admission_no,
        s.gender,
        s.class_id,
        s.section_id,
        s.student_photo,
        s.aadhar_card,
        s.father_photo,
        s.mother_photo,
        u.name,
        u.user_email
     FROM students s
     JOIN users u ON u.user_id = s.user_id
     WHERE s.student_id = ?`,
    [student_id]
  );

  return rows[0];
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

