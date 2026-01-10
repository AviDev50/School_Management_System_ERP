import db from "../../config/db.js";
// modules/student/student.service.js
import bcrypt from 'bcrypt';
import * as studentModel from './student.model.js';

export async function getStudentByIdService(params, req) {
  const { student_id } = params;

  const student = await studentModel.getStudentById(student_id);
  if (!student) {
    throw new Error("Student not found");
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return {
    ...student,

    student_photo_url: student.student_photo
      ? `${baseUrl}/${student.student_photo}`
      : null,

    aadhar_card_url: student.aadhar_card
      ? `${baseUrl}/${student.aadhar_card}`
      : null,

    father_photo_url: student.father_photo
      ? `${baseUrl}/${student.father_photo}`
      : null,

    mother_photo_url: student.mother_photo
      ? `${baseUrl}/${student.mother_photo}`
      : null
  };
}

