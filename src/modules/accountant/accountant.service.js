// modules/accountant/accountant.service.js
import bcrypt from 'bcrypt';
import db from "../../config/db.js";
import * as accountantModel from './accountant.model.js';

export async function updateStudentService(student_id, data, school_id) {
  return schoolAdminModel.updateStudent(student_id, data, school_id);
}

export async function updateTeacherService(teacher_id, data, school_id) {
  return accountantModel.updateTeacher(teacher_id, data, school_id);
}

export async function updateAccountantService(accountant_id, data, school_id) {
  return accountantModel.updateAccountant(accountant_id, data, school_id);
}
