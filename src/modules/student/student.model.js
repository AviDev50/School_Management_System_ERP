import db from "../../config/db.js";

export async function getStudents() {
  const [rows] = await db.query("SELECT * FROM students");
  return rows;
}
