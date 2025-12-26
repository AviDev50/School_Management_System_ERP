import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createSchool,
  findUserByEmail,
  createUser,
  getActiveUserByEmail,
  getSchoolById
} from "./user.model.js";

export async function registerSchoolWithAdmin(data) {
  const {
    school_name,
    email,
    phone,
    address,
    admin_name,
    admin_email,
    password,
  } = data;

  const existingUser = await findUserByEmail(admin_email);
  if (existingUser) {
    return {
      success: false,
      message: "Email already exists",
      data: [],
    };
  }

  const school_id = await createSchool({
    school_name,
    email,
    phone,
    address,
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user_id = await createUser({
    school_id,
    name: admin_name,
    email: admin_email,
    password: hashedPassword,
    role: "school_admin",
  });

  return {
    success: true,
    message: "School & Admin registered successfully",
    data: [
      {
        school_id,
        user_id,
        admin_name,
        admin_email,
      },
    ],
  };
}

export async function loginUser(email, password) {
  const user = await getActiveUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid credentials",
      data: [],
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      success: false,
      message: "Invalid credentials",
      data: [],
    };
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      school_id: user.school_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message: "Login successful",
    data: [
      {
        user_id: user.user_id,
        role: user.role,
        token,
      },
    ],
  };
}

export async function getSchool(id) {
  const school = await getSchoolById(id)

  if (!school) {
    return {
      success: false,
      message: "School not found",
      data: null,
    };
  }

  return {
    success: true,
    message: "School fetched successfully",
    data: school,
  };
}
