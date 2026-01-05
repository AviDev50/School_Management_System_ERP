// modules/teacher/teacher.controller.js
import * as teacherService from './teacher.service.js';

export async function updateTeacher(req, res) {
  try {
    const { school_id, role, teacher_id } = req.body;
    //   const { school_id } = req.user;

    // const { student_id } = req.body || {};

    if (role !== 'school_admin') {
      return res.status(403).json({
        success: false,
        message: "Only school admin can update teachers"
      });
    }

    if (!teacher_id) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required"
      });
    }

    const result = await teacherService.updateTeacherService(
      teacher_id,
      school_id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: result
    });

  } catch (error) {
    console.error("Update Teacher Error:", error.message);

    if (error.message === "Teacher not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes("Email already exists")) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}