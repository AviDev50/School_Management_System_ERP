import bcrypt from "bcrypt";
import * as schoolAdminModel from "./schoolAdmin.model.js";

// Common function for all 
async function registerUser({ name, email, password, role, school_id }) {
  if (!name || !email || !password) throw new Error("Required fields missing");

  const existing = await schoolAdminModel.getUserByEmail(email);
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await schoolAdminModel.createUser({ name, email, password: hashedPassword, role, school_id });

  return { user_id: userId, role, school_id };
}

// Exported functions for all 
export async function registerTeacher(data, school_id) {
  return registerUser({ ...data, role: "TEACHER", school_id });
}

export async function registerStudent(data, school_id) {
  return registerUser({ ...data, role: "STUDENT", school_id });
}

export async function registerAccountant(data, school_id) {
  return registerUser({ ...data, role: "ACCOUNTANT", school_id });
}
