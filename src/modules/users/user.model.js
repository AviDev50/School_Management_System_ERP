import db from "../../config/db.js";
import bcrypt from "bcrypt"

export async function findUserByEmail(user_email) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE user_email = ?",
    [user_email]
  );
  return rows[0] || null;
}

export async function createUser(data) {
  const { name, user_email, password, role, school_id } = data;

  const [result] = await db.query(
    `INSERT INTO users (name, user_email, password, role, school_id)
     VALUES (?, ?, ?, ?, ?)`,
    [name, user_email, password, role, school_id]
  );

  return result.insertId;
}

export async function createSchool(data) {
  const { school_name, email, phone, address } = data;

  const [result] = await db.query(
    `INSERT INTO schools (school_name, email, phone, address)
     VALUES (?, ?, ?, ?)`,
    [school_name, email, phone, address]
  );

  return result.insertId;
}

export async function getSchoolById(school_id) {
  const [rows] = await db.query(
    "SELECT * FROM schools WHERE school_id = ?",
    [school_id]
  );

  return rows[0] || null;
}

export async function getAllSchool() {
  const[rows] = await db.query(
    "select * from schools"
  )
  return rows
}

export async function getStudents() {
   const[rows] = await db.query(
    "select * from students"
  )
  return rows
}

export async function createStudentWithUser(data) {
  const {
    school_id,
    password,
    name,
    user_email,
    admission_no,
    gender,
    class_id,
    section_id
  } = data;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await conn.query(
      `INSERT INTO users (school_id, name, user_email, password, role)
       VALUES (?, ?, ?, ?, 'student')`,
      [school_id, name, user_email || null, hashedPassword]
    );

    const user_id = userResult.insertId;

    const [studentResult] = await conn.query(
      `INSERT INTO students
       (school_id, user_id, admission_no, gender, class_id, section_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        school_id,
        user_id,
        admission_no,
        gender,
        class_id || null,
        section_id || null
      ]
    );

    await conn.commit();

    return {
      student_id: studentResult.insertId,
      user_id,
      admission_no
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}


export async function deleteStudent(data) {
  const { student_id } = data;

  const [result] = await db.query(
    "DELETE FROM students WHERE student_id = ?",
    [student_id]
  );

  return [{
    affected_rows: result.affectedRows
  }];
}

export async function getStudentById(student_id) {
  const [rows] = await db.query(
    "SELECT * FROM students WHERE student_id = ?",
    [student_id]
  );

  return rows[0] || null;
}