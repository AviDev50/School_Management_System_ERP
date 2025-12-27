import * as UserModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const {
      school_name,
      email,
      phone,
      address,
      admin_name,
      admin_email,
      password,
    } = req.body;

    if (!admin_email || !password || !school_name) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existingUser = await UserModel.findUserByEmail(admin_email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const schoolId = await UserModel.createSchool({
      school_name,
      email,
      phone,
      address,
    });

    await UserModel.createUser({
      name: admin_name,
      email: admin_email,
      password: hashedPassword,
      role: "school_admin",
      school_id: schoolId,
    });

    return res.status(201).json({
      success: true,
      message: "School and admin registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function getSchoolDetailsById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "School ID is required",
      });
    }

    const school = await UserModel.getSchoolById(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    return res.json({
      success: true,
      data: school,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
