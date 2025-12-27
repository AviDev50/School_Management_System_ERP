import db from "../../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

export async function createUser(data) {
  const { name, email, password, role, school_id } = data;

  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role, school_id)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, role, school_id]
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

export async function getSchoolById(id) {
  const [rows] = await db.query(
    "SELECT * FROM schools WHERE id = ?",
    [id]
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

export async function createStudent(data) {
  const {
    school_id,
    user_id,
    admission_no,
    gender,
    class_id,
    section_id
  } = data;

  const [result] = await db.query(
    `INSERT INTO students 
     (school_id, user_id, admission_no, gender, class_id, section_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [school_id, user_id, admission_no, gender, class_id, section_id]
  );

   return [
    {
      student_id: result.insertId,
      school_id,
      user_id,
      admission_no,
      gender,
      class_id,
      section_id
    }
  ];
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