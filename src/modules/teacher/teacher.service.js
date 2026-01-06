import bcrypt from 'bcrypt';
import db from "../../config/db.js";
import * as teacherModel from './teacher.model.js';

export async function updateTeacherService(teacher_id, school_id, data) {
  console.log(teacher_id, school_id);
  
  const updatedTeacher = await teacherModel.updateTeacher(
    teacher_id,
    school_id,
    data
  );

  if (!updatedTeacher) {
    throw new Error("Teacher not found or no changes made");
  }

  return updatedTeacher; // updated data return karo
}