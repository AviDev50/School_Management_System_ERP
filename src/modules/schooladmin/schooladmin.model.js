import db from "../../config/db.js";

export async function getUserByEmail(user_email, connection) {
  const [rows] = await connection.query(
    "SELECT user_id FROM users WHERE user_email = ?",
    [user_email]
  );
  return rows[0];
}

export async function createUser({ name, user_email, password, role, school_id }) {
  const [result] = await db.query(
    "INSERT INTO users (school_id,name, user_email, password, role) VALUES (?, ?, ?, ?, ?)",
    [school_id,name, user_email, password, role]
  );
  return result.insertId;
}

export async function createStudent(
  { school_id, user_id, admission_no, gender, class_id, section_id },
  connection
) {
  const [result] = await connection.query(
    `INSERT INTO students 
     (school_id, user_id, admission_no, gender, class_id, section_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [school_id, user_id, admission_no, gender, class_id, section_id]
  );
  return result.insertId;
}

export async function createTeacher(
  { school_id,user_id,qualification,experience_years,joining_date},
  connection
) {
  const [result] = await connection.query(
    `INSERT INTO teachers
     (school_id,user_id,qualification,experience_years,joining_date)
     VALUES (?, ?, ?, ?, ?)`,
    [school_id,user_id,qualification,experience_years,joining_date]
  );
  return result.insertId;
}

export async function createAccountant(
  { school_id,user_id,qualification,experience_years,joining_date},
  connection
) {
  const [result] = await connection.query(
    `INSERT INTO accountants
     (school_id,user_id,qualification)
     VALUES (?,?,?)`,
    [school_id,user_id,qualification]
  );
  return result.insertId;
}

/**
 * Here we Get students list with pagination
 */
export async function getStudentsList({ school_id, limit, offset }) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        u.user_id,
        u.name,
        u.user_email,
        u.status,
        s.school_id,
        s.admission_no,
        s.gender,
        s.class_id,
        s.section_id,
        s.student_id
      FROM users u
      JOIN students s on s.user_id = u.user_id
      WHERE u.school_id = ?
        AND u.role = 'student'
        AND u.status = 1
      ORDER BY u.user_id DESC
      LIMIT ? OFFSET ?`,
      [school_id, limit, offset]
    );

    return rows;
  } finally {
    connection.release();
  }
}

export async function getTotalStudentsCount(school_id) {
  const connection = await db.getConnection();
  try {
    const [[result]] = await connection.query(
      `
      SELECT COUNT(*) AS total
      FROM users
      WHERE school_id = ?
        AND role = 'student'
        AND status = 1
      `,
      [school_id]
    );

    return result.total;
  } finally {
    connection.release();
  }
}

export async function getTeachersList({ school_id, limit, offset }) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        u.user_id,
        u.name,
        u.user_email,
        u.status,
        t.school_id,
        t.teacher_id,
        t.qualification,
        t.experience_years,
        t.joining_date,
        t.status
      FROM users u
      JOIN teachers t on t.user_id = u.user_id
      WHERE u.school_id = ?
        AND u.role = 'teacher'
        AND u.status = 1
      ORDER BY u.user_id DESC
      LIMIT ? OFFSET ?`,
      [school_id, limit, offset]
    );

    return rows;
  } finally {
    connection.release();
  }
}

export async function getTotalTeachersCount(school_id) {
  const connection = await db.getConnection();
  try {
    const [[result]] = await connection.query(
      `
      SELECT COUNT(*) AS total
      FROM users
      WHERE school_id = ?
        AND role = 'teacher'
        AND status = 1
      `,
      [school_id]
    );

    return result.total;
  } finally {
    connection.release();
  }
}