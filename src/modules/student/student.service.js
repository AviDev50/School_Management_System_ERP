import * as schoolAdminModel from "./schooladmin.model.js";

export async function getStudentsDetails() {
  const students = await schoolAdminModel.getStudents();
  return students;
}
