import db from "../../config/db.js";

export async function findUserByEmailAndSchool(user_email, school_id, connection) {
  const [rows] = await connection.query(
    `SELECT user_id 
     FROM users 
     WHERE user_email = ? AND school_id = ?`,
    [user_email, school_id]
  );

  return rows;
}

export async function insertUser(data, connection) {
  const [result] = await connection.query(
    `INSERT INTO users
     (school_id, name, user_email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.name,
      data.user_email,
      data.password,
      data.role
    ]
  );

  return result.insertId;
}

export async function createStudent(data, connection) {
  const [result] = await connection.query(
    `INSERT INTO students
     (school_id,user_id,section_id,class_id,admission_no,gender,
      dob,mobile_number,father_name,mother_name,address,student_photo,aadhar_card,father_photo,mother_photo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.user_id,
      data.section_id,
      data.class_id,
      data.admission_no,
      data.gender,
      data.dob,
      data.mobile_number,
      data.father_name,
      data.mother_name,
      data.address,
      data.student_photo,
      data.aadhar_card,
      data.father_photo,
      data.mother_photo
    ]
  );

  return result.insertId;
}

export async function createTeacher(data, connection) {
  const [result] = await connection.query(
    `INSERT INTO teachers
     (school_id,user_id,qualification,father_name,mother_name,mobile_number,address,experience_years,teacher_photo,aadhar_card)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.user_id,
      data.qualification,
      data.father_name,
      data.mother_name,
      data.mobile_number,
      data.address,
      data.experience_years,
      data.joining_date,
      data.teacher_photo,
      data.aadhar_card
    ]
  );

  return result.insertId;
}

export async function createAccountant(data, connection) {
  const [result] = await connection.query(
    `INSERT INTO accountants
     (school_id,user_id,qualification,father_name,mother_name,mobile_number,experience_years,address,accountant_photo,aadhar_card)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.user_id,
      data.qualification,
      data.father_name,
      data.mother_name,
      data.mobile_number,
      data.experience_years,
      data.address,
      data.accountant_photo,
      data.aadhar_card
    ]
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
        s.student_id,
        c.class_name,         
        sec.section_name,
        s.student_photo,
        s.aadhar_card,
        s.father_photo,
        s.mother_photo   
      FROM users u
      JOIN students s ON s.user_id = u.user_id
      LEFT JOIN classes c ON c.class_id = s.class_id
      LEFT JOIN sections sec ON sec.section_id = s.section_id
      WHERE u.school_id = ?
        AND u.role = 'student'
        AND u.status = 1
      ORDER BY u.created_at DESC
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
        t.teacher_id,
        t.school_id,
        t.qualification,
        t.experience_years,
        t.joining_date,
        t.teacher_photo,
        t.aadhar_card
      FROM users u
      JOIN teachers t ON t.user_id = u.user_id
      WHERE u.school_id = ?
        AND u.role = 'teacher'
        AND u.status = 1
      ORDER BY u.created_at DESC
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

export async function getAccountantsList({ school_id, limit, offset }) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      ` SELECT 
        u.name,
        u.user_email,
        u.status,
        a.accountant_id,
        a.qualification,
        a.accountant_photo,
        a.aadhar_card
      FROM users u
      JOIN accountants a ON a.user_id = u.user_id
      WHERE u.school_id = ?
        AND u.role = 'accountant'
        AND u.status = 1
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?`,
      [school_id, limit, offset]
    );

    return rows;
  } finally {
    connection.release();
  }
}

export async function getTotalAccountantsCount(school_id) {
  const connection = await db.getConnection();
  try {
    const [[result]] = await connection.query(
      `
      SELECT COUNT(*) AS total
      FROM users
      WHERE school_id = ?
        AND role = 'accountant'
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
    const { class_name, class_order, class_details} = data;

    const [result] = await connection.query(
      `INSERT INTO classes 
       (school_id, class_name, class_order, class_details)
       VALUES (?, ?, ?, ?)`,
      [school_id, class_name, class_order, class_details || null]
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
         status
       FROM classes
       WHERE school_id = ?
       AND status = 1
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
    const { class_id, section_name } = data;

    const [result] = await connection.query(
      `UPDATE sections
       SET section_name = ?,
           class_id = ?
       WHERE section_id = ?
         AND school_id = ?`,
      [section_name, class_id, section_id, school_id]
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
         s.section_id,
         s.class_id,
         s.section_name,
         c.class_name
       FROM sections s
       JOIN classes c 
         ON c.class_id = s.class_id
        AND c.school_id = s.school_id
       WHERE s.school_id = ?
         AND s.class_id = ?
         AND s.status = 1
       ORDER BY s.section_name ASC`,
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
      SET subject_id = ?, teacher_id = ?,day_of_week=? ,start_time = ?, end_time = ?
      WHERE timetable_id = ?
    `;
    await connection.query(sql, [
      data.subject_id,
      data.teacher_id,
      data.day_of_week,
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

export async function getStudentById(student_id, school_id) {
  const connection = await db.getConnection()
  
  const query = `
    SELECT 
      s.*,
      u.name,
      u.user_email
    FROM students s
    JOIN users u ON u.user_id = s.user_id
    WHERE s.student_id = ? AND s.school_id = ?
  `;

  const [result] = await connection.query(query, [
    student_id,
    school_id
  ]);

  return result;
}

export async function getTeacherById(teacher_id, school_id) {
  const connection = await db.getConnection()
  const query = `
    SELECT 
      t.*,
      u.name,
      u.user_email
    FROM teachers t
    JOIN users u ON u.user_id = t.user_id
    WHERE t.teacher_id = ? AND t.school_id = ?
  `;

  const [result] = await connection.query(query, [
    teacher_id,
    school_id
  ]);

  return result;
}

export async function getAccountantById(accountant_id, school_id) {
  const connection = await db.getConnection()
  const query = `
    SELECT *
    FROM accountants
    WHERE accountant_id = ? AND school_id = ?
  `;

  const [result] = await connection.query(query, [
    accountant_id,
    school_id
  ]);

  return result;
}

export async function insertFee(data) {
  const {
    school_id,
    class_id,
    fee_type,
    amount,
    academic_year,
    status
  } = data;

  const sql = `
    INSERT INTO fees
    (school_id, class_id, fee_type, amount, academic_year, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    school_id,
    class_id,
    fee_type,
    amount,
    academic_year || null,
    status
  ]);

  return result;
}

export async function getFeesList(filters) {
  const {
    school_id,
    class_id,
    academic_year,
    status,
    limit,
    offset
  } = filters;

  let sql = `
    SELECT
      f.fee_id,
      f.school_id,
      f.class_id,
      c.class_name,
      f.fee_type,
      f.amount,
      f.academic_year,
      f.status,
      f.created_at
    FROM fees f
    JOIN classes c ON c.class_id = f.class_id
    WHERE f.school_id = ?
  `;

  const params = [Number(school_id)];

  if (class_id) {
    sql += " AND f.class_id = ?";
    params.push(Number(class_id));
  }

  if (academic_year) {
    sql += " AND f.academic_year = ?";
    params.push(academic_year);
  }

  if (status !== undefined && !Number.isNaN(status)) {
    sql += " AND f.status = ?";
    params.push(Number(status));
  }

  sql += ` ORDER BY f.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

  const [rows] = await db.execute(sql, params);
  return rows;
}

export async function getFeesCount(filters) {
  const {
    school_id,
    class_id,
    academic_year,
    status
  } = filters;

  let sql = `
    SELECT COUNT(*) AS total
    FROM fees
    WHERE school_id = ?
  `;

  const params = [school_id];

  if (class_id) {
    sql += " AND class_id = ?";
    params.push(class_id);
  }

  if (academic_year) {
    sql += " AND academic_year = ?";
    params.push(academic_year);
  }

  if (status !== undefined) {
    sql += " AND status = ?";
    params.push(status);
  }

  const [rows] = await db.execute(sql, params);
  return rows[0].total;
}

export async function updateFee(fee_id, school_id, payload) {
  const sql = `
    UPDATE fees
    SET ?
    WHERE fee_id = ? AND school_id = ?
  `;

  await db.query(sql, [
    payload,
    Number(fee_id),
    Number(school_id)
  ]);
}

export async function softDeleteFee(fee_id, school_id) {
  const sql = `
    UPDATE fees
    SET status = 0
    WHERE fee_id = ? AND school_id = ?
  `;

  await db.execute(sql, [
    Number(fee_id),
    Number(school_id)
  ]);
}

export async function getFeeById(fee_id, school_id) {
  const sql = `
    SELECT *
    FROM fees
    WHERE fee_id = ? AND school_id = ?
  `;

  const [rows] = await db.execute(sql, [
    Number(fee_id),
    Number(school_id)
  ]);

  return rows[0];
}

//here we get old image path
export async function getStudentPhotosById(student_id, school_id, connection) {
  const [rows] = await connection.query(
    `SELECT student_photo, aadhar_card, father_photo, mother_photo
     FROM students
     WHERE student_id = ? AND school_id = ?`,
    [student_id, school_id]
  );

  return rows[0];
}

export async function updateUserByStudentId(student_id, school_id, data, connection) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(student_id, school_id);

  const sql = `
    UPDATE users u
    JOIN students s ON s.user_id = u.user_id
    SET ${fields.join(", ")}
    WHERE s.student_id = ? AND s.school_id = ?
  `;

  await connection.query(sql, values);
}

export async function updateStudentById(student_id, school_id, data, connection) {
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

  await connection.query(sql, values);
}

export async function getTeacherPhotosById(teacher_id, school_id, connection) {
  const [rows] = await connection.query(
    `SELECT teacher_photo, aadhar_card
     FROM teachers
     WHERE teacher_id = ? AND school_id = ?`,
    [teacher_id, school_id]
  );
  return rows[0];
}

export async function updateUserByTeacherId(
  teacher_id,
  school_id,
  data,
  connection
) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(teacher_id, school_id);

  const sql = `
    UPDATE users u
    JOIN teachers t ON t.user_id = u.user_id
    SET ${fields.join(", ")}
    WHERE t.teacher_id = ? AND t.school_id = ?
  `;

  await connection.query(sql, values);
}

export async function updateTeacherById(
  teacher_id,
  school_id,
  data,
  connection
) {
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

  await connection.query(sql, values);
}

export async function getAccountantPhotosById(accountant_id, school_id, connection) {
  const [rows] = await connection.query(
    `SELECT accountant_photo, aadhar_card
     FROM accountants
     WHERE accountant_id = ? AND school_id = ?`,
    [accountant_id, school_id]
  );
  return rows[0];
}

export async function updateUserByAccountantId(
  accountant_id,
  school_id,
  data,
  connection
) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(accountant_id, school_id);

  const sql = `
    UPDATE users u
    JOIN accountants a ON a.user_id = u.user_id
    SET ${fields.join(", ")}
    WHERE a.accountant_id = ? AND a.school_id = ?
  `;

  await connection.query(sql, values);
}

export async function updateAccountantById(
  accountant_id,
  school_id,
  data,
  connection
) {
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

  await connection.query(sql, values);
}

export async function softDeleteStudent(student_id, school_id, connection) {
  await connection.query(
    `UPDATE students
     SET status = 0
     WHERE student_id = ? AND school_id = ?`,
    [student_id, school_id]
  );
}

export async function softDeleteUserByStudentId(student_id, school_id, connection) {
  await connection.query(
    `UPDATE users u
     JOIN students s ON s.user_id = u.user_id
     SET u.status = 0
     WHERE s.student_id = ? AND s.school_id = ?`,
    [student_id, school_id]
  );
}

export async function softDeleteTeacher(teacher_id, school_id, connection) {
  await connection.query(
    `UPDATE teachers
     SET status = 0
     WHERE teacher_id = ? AND school_id = ?`,
    [teacher_id, school_id]
  );
}

export async function softDeleteUserByTeacherId(teacher_id, school_id, connection) {
  await connection.query(
    `UPDATE users u
     JOIN teachers t ON t.user_id = u.user_id
     SET u.status = 0
     WHERE t.teacher_id = ? AND t.school_id = ?`,
    [teacher_id, school_id]
  );
}

export async function softDeleteAccountant(accountant_id, school_id, connection) {
  await connection.query(
    `UPDATE accountants
     SET status = 0
     WHERE accountant_id = ? AND school_id = ?`,
    [accountant_id, school_id]
  );
}

export async function softDeleteUserByAccountantId(
  accountant_id,
  school_id,
  connection
) {
  await connection.query(
    `UPDATE users u
     JOIN accountants a ON a.user_id = u.user_id
     SET u.status = 0
     WHERE a.accountant_id = ? AND a.school_id = ?`,
    [accountant_id, school_id]
  );
}

export async function getNoticesBySchool({ school_id }) {
  const sql = `
    SELECT notice_id, title, message, created_at
    FROM notices
    WHERE school_id = ?
    ORDER BY notice_id DESC
  `;
  const [rows] = await db.execute(sql, [school_id]);
  return rows;
}

export async function getNoticeById({ notice_id, school_id }) {
  const sql = `
    SELECT notice_id, title, message, created_at
    FROM notices
    WHERE notice_id = ? AND school_id = ?
  `;
  const [rows] = await db.execute(sql, [notice_id, school_id]);
  return rows[0];
}

export async function updateNotice({ notice_id, school_id, fields, values }) {
  const sql = `
    UPDATE notices
    SET ${fields.join(", ")}
    WHERE notice_id = ? AND school_id = ?
  `;
  const [result] = await db.execute(sql, [...values, notice_id, school_id]);
  return result;
}

export async function deleteNotice({ notice_id, school_id }) {
  const sql = `
    DELETE FROM notices
    WHERE notice_id = ? AND school_id = ?
  `;
  const [result] = await db.execute(sql, [notice_id, school_id]);
  return result;
}

export async function createNotice({
  school_id,
  title,
  message
}) {
  const sql = `
    INSERT INTO notices (school_id, title, message)
    VALUES (?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    school_id,
    title,
    message
  ]);

  return result;
}

export async function checkStudentAttendanceExists(student_id, attendance_date) {
  const [rows] = await db.query(
    `SELECT attendance_id FROM student_attendance
     WHERE student_id = ? AND attendance_date = ?`,
    [student_id, attendance_date]
  );
  return rows.length > 0;
}

export async function createAttendance(data) {
  const [result] = await db.query(
    `INSERT INTO student_attendance
     (school_id, student_id, class_id, section_id, attendance_date, status, remarks, marked_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.student_id,
      data.class_id,
      data.section_id,
      data.attendance_date,
      data.status,
      data.remarks || null,
      data.marked_by
    ]
  );

  return { attendance_id: result.insertId };
}

export async function getAttendance(school_id, filters) {
  let query = `
    SELECT sa.*, s.admission_no, u.name AS student_name
    FROM student_attendance sa
    JOIN students s ON s.student_id = sa.student_id
    JOIN users u ON u.user_id = s.user_id
    WHERE sa.school_id = ?
  `;
  const params = [school_id];

  if (filters.class_id) {
    query += " AND sa.class_id = ?";
    params.push(filters.class_id);
  }

  if (filters.section_id) {
    query += " AND sa.section_id = ?";
    params.push(filters.section_id);
  }

  if (filters.attendance_date) {
    query += " AND sa.attendance_date = ?";
    params.push(filters.attendance_date);
  }

  query += " ORDER BY sa.attendance_date DESC";

  const [rows] = await db.query(query, params);
  return rows;
}

export async function updateAttendance(attendance_id, school_id, data) {
  const [result] = await db.query(
    `UPDATE student_attendance
     SET status = ?, remarks = ?
     WHERE attendance_id = ? AND school_id = ?`,
    [
      data.status,
      data.remarks || null,
      attendance_id,
      school_id
    ]
  );

  return result.affectedRows > 0;
}

export async function deleteAttendance(attendance_id, school_id) {
  const [result] = await db.query(
    `DELETE FROM student_attendance
     WHERE attendance_id = ? AND school_id = ?`,
    [attendance_id, school_id]
  );

  return result.affectedRows > 0;
}

export async function checkTeacherAttendanceExists(
  teacher_id,
  attendance_date
) {
  const [rows] = await db.query(
    `SELECT attendance_id
     FROM teacher_attendance
     WHERE teacher_id = ? AND attendance_date = ?`,
    [teacher_id, attendance_date]
  );
  return rows.length > 0;
}

export async function createTeacherAttendance(data) {
  const [result] = await db.query(
    `INSERT INTO teacher_attendance
     (school_id, teacher_id, attendance_date, status, remarks, marked_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.teacher_id,
      data.attendance_date,
      data.status,
      data.remarks || null,
      data.marked_by
    ]
  );

  return { attendance_id: result.insertId };
}

export async function getTeacherAttendance(school_id, filters) {
  let query = `
    SELECT ta.*, u.name AS teacher_name
    FROM teacher_attendance ta
    JOIN teachers t ON t.teacher_id = ta.teacher_id
    JOIN users u ON u.user_id = t.user_id
    WHERE ta.school_id = ?
  `;
  const params = [school_id];

  if (filters.teacher_id) {
    query += " AND ta.teacher_id = ?";
    params.push(filters.teacher_id);
  }

  if (filters.attendance_date) {
    query += " AND ta.attendance_date = ?";
    params.push(filters.attendance_date);
  }

  query += " ORDER BY ta.attendance_date DESC";

  const [rows] = await db.query(query, params);
  return rows;
}

export async function updateTeacherAttendance(
  attendance_id,
  school_id,
  data
) {
  const [result] = await db.query(
    `UPDATE teacher_attendance
     SET status = ?, remarks = ?
     WHERE attendance_id = ? AND school_id = ?`,
    [
      data.status,
      data.remarks || null,
      attendance_id,
      school_id
    ]
  );

  return result.affectedRows > 0;
}

export async function deleteTeacherAttendance(attendance_id, school_id) {
  const [result] = await db.query(
    `DELETE FROM teacher_attendance
     WHERE attendance_id = ? AND school_id = ?`,
    [attendance_id, school_id]
  );

  return result.affectedRows > 0;
}

export async function checkAccountantAttendanceExists(
  accountant_id,
  attendance_date
) {
  const [rows] = await db.query(
    `SELECT attendance_id
     FROM accountant_attendance
     WHERE accountant_id = ? AND attendance_date = ?`,
    [accountant_id, attendance_date]
  );
  return rows.length > 0;
}

export async function createAccountantAttendance(data) {
  const [result] = await db.query(
    `INSERT INTO accountant_attendance
     (school_id, accountant_id, attendance_date, status, remarks, marked_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.accountant_id,
      data.attendance_date,
      data.status,
      data.remarks || null,
      data.marked_by
    ]
  );

  return { attendance_id: result.insertId };
}

export async function getAccountantAttendance(school_id, filters) {
  let query = `
    SELECT aa.*, u.name AS accountant_name
    FROM accountant_attendance aa
    JOIN accountants a ON a.accountant_id = aa.accountant_id
    JOIN users u ON u.user_id = a.user_id
    WHERE aa.school_id = ?
  `;
  const params = [school_id];

  if (filters.accountant_id) {
    query += " AND aa.accountant_id = ?";
    params.push(filters.accountant_id);
  }

  if (filters.attendance_date) {
    query += " AND aa.attendance_date = ?";
    params.push(filters.attendance_date);
  }

  query += " ORDER BY aa.attendance_date DESC";

  const [rows] = await db.query(query, params);
  return rows;
}

export async function updateAccountantAttendance(
  attendance_id,
  school_id,
  data
) {
  const [result] = await db.query(
    `UPDATE accountant_attendance
     SET status = ?, remarks = ?
     WHERE attendance_id = ? AND school_id = ?`,
    [
      data.status,
      data.remarks || null,
      attendance_id,
      school_id
    ]
  );

  return result.affectedRows > 0;
}

export async function deleteAccountantAttendance(attendance_id, school_id) {
  const [result] = await db.query(
    `DELETE FROM accountant_attendance
     WHERE attendance_id = ? AND school_id = ?`,
    [attendance_id, school_id]
  );

  return result.affectedRows > 0;
}

export async function getAllClassListById(school_id) {
  const [rows] = await db.query(
    `SELECT class_id, class_name
     FROM classes
     WHERE school_id = ? AND status = 1
     ORDER BY class_name ASC`,
    [school_id]
  );

  return rows;
}
