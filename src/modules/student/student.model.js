import db from "../../config/db.js";

export async function getStudentById(student_id) {
  const connection = await db.getConnection();

  try {
    const [rows] = await connection.query(
      "SELECT * FROM students WHERE student_id = ?",
      [student_id]
    );

    return rows;
  } catch (error) {
    console.error("Error getting student details:", error);
    throw error;
  } finally {
    connection.release(); 
  }
}

export async function updateUser(connection, data) {
  const sql = `
    UPDATE users
    SET 
      name = ?,
      user_email = ?
    WHERE user_id = ?
  `;

  const values = [
    data.name,
    data.user_email,
    data.user_id
  ];

  await connection.query(sql, values);
}

export async function upsertUser(connection, data) {
  const sql = `
    INSERT INTO users (
      school_id,
      name,
      email,
      role,
      status
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      email = VALUES(email),
      status = VALUES(status)
  `;

  const values = [
    data.school_id,
    data.name,
    data.email,
    data.role || "student",
    data.status || 1
  ];

  const [result] = await connection.query(sql, values);
  return result;
}


export async function upsertStudent(connection, data) {
  const sql = `
    INSERT INTO students (user_id,schoo_id,class_id, section_id)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      class_id = VALUES(class_id),
      section_id = VALUES(section_id)
  `;

  await connection.query(sql, [
    data.user_id,
    data.class_id,
    data.section_id
  ]);
}


