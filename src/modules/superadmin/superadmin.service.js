import bcrypt from "bcrypt";
import db from "../../config/db.js";
import * as superAdminModel from "./superadmin.model.js";

export async function createSchoolWithAdminService(data) {
  const {
    school_name,
    email,
    phone,
    address,
    name,
    user_email,
    password,
  } = data;

  if (
    !school_name ||
    !email ||
    !phone ||
    !address
  ) {
    throw new Error("Required fields missing");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const schoolId = await superAdminModel.createSchool(
      connection,
      school_name,
      email,
      phone,
      address,
    );

    const existing = await superAdminModel.getUserByEmail(
      connection,
      user_email
    );
    if (existing) {
      throw new Error("Admin email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await superAdminModel.createUser(connection,{
      name,
      user_email,
      password: hashedPassword,
      role: "school_admin",
      schoolId
      }
    );

    await superAdminModel.createSchoolAdmin(
      connection,
      userId,
      schoolId
    );

    await connection.commit();

    return {
      school_id: schoolId,
      admin_user_id: userId,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function login(email, password) {
  if (!email || !password) throw new Error("Email and password required");

  const superAdmin = await superAdminModel.getSuperAdminByEmail(email);
  if (!superAdmin) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, superAdmin.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      user_id: superAdmin.super_admin_id,
      role: "SUPER_ADMIN",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user: { user_id: superAdmin.super_admin_id, role: "SUPER_ADMIN" } };
}
