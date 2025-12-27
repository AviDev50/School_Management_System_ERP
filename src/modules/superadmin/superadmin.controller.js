import * as SuperAdminModel from "./superadmin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerSuperAdmin(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        data: [],
      });
    }

    const existing = await SuperAdminModel.findSuperAdminByEmail(email);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Super Admin already exists",
        data: [],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdminId = await SuperAdminModel.createSuperAdmin({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Super Admin registered successfully",
      data: { superAdminId },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: [],
    });
  }
}

export async function loginSuperAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
        token: null,
      });w
    }

    const admin = await SuperAdminModel.findSuperAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        token: null,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        token: null,
      });
    }

    const token = jwt.sign(
      { superAdminId: admin.id, role: "SUPER_ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      token: null,
    });
  }
}
