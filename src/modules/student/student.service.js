import * as studentModel from "./student.model.js";
import db from "../../config/db.js";


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

export async function upsertStudentService(data) {
  const connection = await db.getConnection();
   
  try {
    await connection.beginTransaction();

    if (data.name || data.email) {
      await studentModel.updateUser(connection, {
        user_id: data.user_id,
        name: data.name,
        email: data.user_email
      });
    }

    await studentModel.upsertStudent(connection, {
      user_id: data.user_id,
      admission_no: data.admission_no,
      class_id: data.class_id,
      section_id: data.section_id
    });

    await connection.commit();
    return { user_id: data.user_id };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
