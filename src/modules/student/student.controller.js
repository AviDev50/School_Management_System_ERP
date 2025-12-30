import * as studentModel from "./student.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function addStudent(req, res) {
  try {
    const {
      admission_no,
      gender,
      class_id,
      section_id,
      name,
      user_email,
      password
    } = req.body;

   const school_id = req.user.school_id; // token se nahi then we use

    if (!name || !admission_no || !gender || !password) {
      return res.status(400).json({
        success: false,
        message: "name, admission_no, gender and password are required",
      });
    }

    const result = await schoolAdminModel.createStudentWithUser({
      school_id,
      name,
      user_email,
      password,
      admission_no,
      gender,
      class_id,
      section_id
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: result
    });

  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Admission number or email already exists",
      });
    }

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

export async function deleteStudent(req,res) {
  try{
  const{student_id} = req.body

   if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }
  
    const student = await schoolAdminModel.deleteStudent({student_id})

        if (student[0].affected_rows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: []
      });
    }

     return res.status(201).json({
      success: true,
      message: "Student deleted successfully",
      data: student
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data:[]
    });
  }
}

export async function getStudentDetailsById(req, res) {
  try {
    const {student_id} = req.params;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required",
      });
    }

    const student = await schoolAdminModel.getStudentById(student_id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    return res.json({
      success: true,
      data: student,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function getAllStudentDetails(req,res) {
  try {
    const students = await schoolAdminModel.getStudents()

    return res.status(200).json({
      success: true,
      message: "All Students details get successfully",
      data: students
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Server error"
    })
  
  }
}