import * as schoolAdminModel from "./schooladmin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerSchoolAdminWithSchool(req, res) {
  try {
    const {
      school_id,
      name,
      user_email,
      password,
      role,
      school_name,
      email,
      phone,
      address
    } = req.body;

    if (!user_email || !password || !school_name) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existingUser = await schoolAdminModel.findUserByEmail(user_email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const schoolId = await schoolAdminModel.createSchool({
      school_name,
      email,
      phone,
      address,
    });

    await schoolAdminModel.createUser({
      school_id:schoolId,
      name,
      user_email,
      password: hashedPassword,
      role
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

    const user = await schoolAdminModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch =await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.user_id,school_id:user.school_id,role: user.role },
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
    const { school_id } = req.params;

    if (!school_id) {
      return res.status(400).json({
        success: false,
        message: "School ID is required",
      });
    }

    const school = await schoolAdminModel.getSchoolById(school_id);

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

export async function getAllSchoolDetails(req,res) {
  try {
    const school = await schoolAdminModel.getAllSchool()

    return res.status(200).json({
      success: true,
      message: "All School details get successfully",
      data: school
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Server error"
    })
    
  }
}


