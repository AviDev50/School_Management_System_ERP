import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findSuperAdminByEmail,
  createSuperAdmin,
} from "./superadmin.model.js";

export async function registerSuperAdmin(data) {
  const { name, email, password } = data;

  const existing = await findSuperAdminByEmail(email);
  if (existing) {
    return {
      success: false,
      message: "Email already exists",
      data: [],
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const super_admin_id = await createSuperAdmin({
    name,
    email,
    password: hashedPassword,
  });

  return {
    success: true,
    message: "Super Admin registered successfully",
    data: [
      {
        super_admin_id,
        name,
        email,
      },
    ],
  };
}

export async function loginSuperAdmin(email, password) {
  const admin = await findSuperAdminByEmail(email);

  if (!admin) {
    return {
      success: false,
      message: "Invalid credentials",
      data: [],
    };
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return {
      success: false,
      message: "Invalid credentials",
      data: [],
    };
  }

  const token = jwt.sign(
    {
      super_admin_id: admin.super_admin_id,
      role: "super_admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message: "Login successful",
    data: [
      {
        super_admin_id: admin.super_admin_id,
        role: "super_admin",
        token,
      },
    ],
  };
}
