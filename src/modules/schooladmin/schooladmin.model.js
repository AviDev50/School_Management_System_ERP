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

export async function createClass(school_id, data) {
  const connection = await db.getConnection();
  try {
    const { class_name, class_order, class_details, status } = data;

    const [result] = await connection.query(
      `INSERT INTO classes 
       (school_id, class_name, class_order, class_details, status)
       VALUES (?, ?, ?, ?, ?)`,
      [school_id, class_name, class_order, class_details || null, status ?? 1]
    );

    return { class_id: result.insertId };
  } finally {
    connection.release();
  }
}

export async function updateClass(class_id, school_id, data) {
  const connection = await db.getConnection();
  try {
    const { class_name, class_order, class_details, status } = data;

    const [result] = await connection.query(
      `UPDATE classes 
       SET class_name = ?, 
           class_order = ?, 
           class_details = ?, 
           status = ?
       WHERE class_id = ? AND school_id = ?`,
      [
        class_name,
        class_order,
        class_details || null,
        status,
        class_id,
        school_id,
      ]
    );

    return result.affectedRows;
  } finally {
    connection.release();
  }
}

export async function getAllClasses(school_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
         class_id,
         class_name,
         class_order,
         class_details,
         status,
         created_at
       FROM classes
       WHERE school_id = ?
       ORDER BY class_order ASC`,
      [school_id]
    );

    return rows;
  } finally {
    connection.release();
  }
}

export async function deleteClass(class_id, school_id) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE classes 
       SET status = 0
       WHERE class_id = ? AND school_id = ?`,
      [class_id, school_id]
    );

    return result.affectedRows;
  } finally {
    connection.release();
  }
}

export async function createSection(school_id, data) {
  const connection = await db.getConnection();
  try {
    const { class_id, section_name, status } = data;

    const [result] = await connection.query(
      `INSERT INTO sections 
       (school_id, class_id, section_name, status)
       VALUES (?, ?, ?, ?)`,
      [school_id, class_id, section_name, status ?? 1]
    );

    return { section_id: result.insertId };
  } finally {
    connection.release();
  }
}

export async function updateSection(section_id, school_id, data) {
  const connection = await db.getConnection();
  try {
    const { section_name, status } = data;

    const [result] = await connection.query(
      `UPDATE sections
       SET section_name = ?, status = ?
       WHERE section_id = ? AND school_id = ?`,
      [section_name, status, section_id, school_id]
    );

    return result.affectedRows;
  } finally {
    connection.release();
  }
}

export async function getAllSections(school_id, class_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
         section_id,
         class_id,
         section_name,
         status
       FROM sections
       WHERE school_id = ? AND class_id = ?
       ORDER BY section_name ASC`,
      [school_id, class_id]
    );

    return rows;
  } finally {
    connection.release();
  }
}

export async function deleteSection(section_id, school_id) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE sections
       SET status = 0
       WHERE section_id = ? AND school_id = ?`,
      [section_id, school_id]
    );

    return result.affectedRows;
  } finally {
    connection.release();
  }
}

export async function createSubject(school_id, data) {
  const connection = await db.getConnection();
  try {
    const { subject_name, status } = data;

    const [result] = await connection.query(
      `INSERT INTO subjects 
       (school_id, subject_name, status)
       VALUES (?, ?, ?)`,
      [school_id, subject_name, status ?? 1]
    );

    return { subject_id: result.insertId };
  } finally {
    connection.release();
  }
}

export async function updateSubject(subject_id,subject_name, school_id) {
  const connection = await db.getConnection();
  try {
    //const { subject_id,subject_name, school_id} = data;

    const [result] = await connection.query(
      `UPDATE subjects
       SET subject_name = ?
       WHERE subject_id = ? AND school_id = ?`,
      [subject_name,subject_id, school_id]
    );

    return result.affectedRows;

  } finally {
    connection.release();
  }
}

export async function getAllSubjects(school_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
         subject_id,
         subject_name,
         status
       FROM subjects
       WHERE school_id = ?
       ORDER BY subject_name ASC`,
      [school_id]
    );

    return rows;
  } finally {
    connection.release();
  }
}

export async function deleteSubject(subject_id, school_id) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE subjects
       SET status = 0
       WHERE subject_id = ? AND school_id = ?`,
      [subject_id, school_id]
    );

    return result.affectedRows;
  } finally {
    connection.release();
  }
}

export async function createTimetable(data) {
  const connection = await db.getConnection();
  try {
    const sql = `
      INSERT INTO timetables
      (school_id, class_id, section_id, subject_id, teacher_id, day_of_week, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(sql, [
      data.school_id,
      data.class_id,
      data.section_id,
      data.subject_id,
      data.teacher_id,
      data.day_of_week,
      data.start_time,
      data.end_time
    ]);
  } finally {
    connection.release();
  }
}

export async function updateTimetable(timetable_id, data) {
  const connection = await db.getConnection();
  try {
    const sql = `
      UPDATE timetables
      SET subject_id = ?, teacher_id = ?, start_time = ?, end_time = ?
      WHERE timetable_id = ?
    `;
    await connection.query(sql, [
      data.subject_id,
      data.teacher_id,
      data.start_time,
      data.end_time,
      timetable_id
    ]);
  } finally {
    connection.release();
  }
}

export async function deleteTimetable(timetable_id) {
  const connection = await db.getConnection();
  try {
    await connection.query(
      "DELETE FROM timetables WHERE timetable_id = ?",
      [timetable_id]
    );
  } finally {
    connection.release();
  }
}

export async function getTimetable({ school_id, class_id, section_id }) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM timetables
       WHERE school_id = ? AND class_id = ? AND section_id = ?
       ORDER BY day_of_week, start_time`,
      [school_id, class_id, section_id]
    );
    return rows;
  } finally {
    connection.release();
  }
}






