// modules/teacher/teacher.model.js

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
    const { teacher_id} = data;

    const [result] = await connection.query(
      `UPDATE teachers
       SET ?
       WHERE teacher_id = ? AND school_id = ?`,
      [teacher_id, school_id]
    );

    return result.affectedRows;
  } finally {
    connection.release();
  }
}
