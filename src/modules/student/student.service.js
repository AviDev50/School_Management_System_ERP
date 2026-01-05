import db from "../../config/db.js";
// modules/student/student.service.js
import bcrypt from 'bcrypt';
import * as studentModel from './student.model.js';



export async function getStudentByIdService(data) {
  try {
    const { student_id } = data;

    if (!student_id) {
      throw new Error("student_id is required");
    }

    const students = await studentModel.getStudentById(student_id);

    return students;
  } catch (error) {
    console.error("Service error (getStudentById):", error);
    throw error;
  }
}


export async function updateStudentService(student_id, school_id, data) {

  // delete data.student_id;

  const affectedRows = await studentModel.updateStudent(
    student_id,
    school_id,
    data
  );

  if (affectedRows === 0) {
    throw new Error("Student not found");
  }

  return true;
}
